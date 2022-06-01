
import { createContext } from "react";
import { Evt } from "evt";
import type { StatefulEvt } from "evt";
import { useRerenderOnStateChange } from "evt/hooks/useRerenderOnStateChange";
import { useConstCallback } from "./useConstCallback";
import { overwriteReadonlyProp } from "tsafe/lab/overwriteReadonlyProp";
import type { UseNamedStateReturnType } from "./useNamedState";
import { typeGuard } from "tsafe/typeGuard";
import { capitalize } from "./tools/capitalize";
import memoize from "memoizee";
import { addParamToUrl, retrieveAllParamStartingWithPrefixFromUrl, updateSearchBarUrl } from "./tools/urlSearchParams";

export type { StatefulEvt };

const {
    globalStates,
    persistedGlobalStateNames
} = (() => {

    type SharedContext = {
        globalStates: Readonly<Record<string, unknown>>;
        persistedGlobalStateNames: Set<string>;
    };

    const propertyKey = "__powerhooks_useGlobalState_context";

    const peerDepObj: Record<typeof propertyKey, SharedContext | undefined> = createContext as any;

    let sharedContext = peerDepObj.__powerhooks_useGlobalState_context;

    if (sharedContext === undefined) {

        sharedContext = {
            "globalStates": {},
            "persistedGlobalStateNames": new Set<string>()
        };

        Object.defineProperty(peerDepObj, propertyKey, {
            "configurable": false,
            "enumerable": false,
            "writable": false,
            "value": sharedContext
        });
    }

    return sharedContext;

})();

export { globalStates };


function stringify(obj: unknown): string {
    return JSON.stringify([obj]);
}

function parse<T>(str: string): T {
    return JSON.parse(str)[0];
}

const prefix = "powerhooks_useGlobalState_";

const { injectGlobalStatesInSearchParams, getStatesFromUrlSearchParams } = (() => {

    /** Returns the modified url */
    function injectGlobalStatesInSearchParams(url: string): string {

        let newUrl = url;

        Object.keys(globalStates)
            .filter(name => persistedGlobalStateNames.has(name))
            .forEach(name =>
                newUrl =
                addParamToUrl({
                    "url": newUrl,
                    "name": `${prefix}${name}`,
                    "value": stringify(globalStates[name])
                })
                    .newUrl
            );

        return newUrl;

    }

    const getUnparsedStatesFromUrlSearchParams = memoize(() => {

        const {
            newUrl,
            values: unparsedStates
        } = retrieveAllParamStartingWithPrefixFromUrl({
            "url": window.location.href,
            prefix,
            "doLeavePrefixInResults": false
        });

        updateSearchBarUrl(newUrl);

        return { unparsedStates };

    })

    function getStatesFromUrlSearchParams<T>(
        params: {
            name: string;
        }
    ): { wasPresent: false; } | { wasPresent: true; state: T; } {

        const { name } = params;

        const { unparsedStates } = getUnparsedStatesFromUrlSearchParams();

        if (!(name in unparsedStates)) {
            return { "wasPresent": false };
        }

        return {
            "wasPresent": true,
            "state": parse(unparsedStates[name])
        };

    }

    return {
        injectGlobalStatesInSearchParams,
        getStatesFromUrlSearchParams
    };

})();

export { injectGlobalStatesInSearchParams };



/**
 * 
 * Assert: If localStorageKey is not disabled, T must be 
 * serializable with JSON.stringify.
 * 
 * const { useFoo } = createUseGlobalState2({
 *     "getDefaultState": ()=> 33,
 *     "name": "foo"
 * });
 *
 * const { foo, setFoo  } = useFoo();
 * 
 * By default persistance is enabled using localStorage.
 * 
 */
export function createUseGlobalState<T, Name extends string>(
    params: {
        name: Name,
        /** If function called only if not in local storage */
        initialState: T | (() => T),
        doPersistAcrossReloads: boolean;
    }
): Record<
    `use${Capitalize<Name>}`,
    () => UseNamedStateReturnType<T, Name>
> & Record<
    `evt${Capitalize<Name>}`,
    StatefulEvt<T>
> {

    const { name, initialState, doPersistAcrossReloads } = params;

    if( doPersistAcrossReloads) {

        persistedGlobalStateNames.add(name);

    }

    //NOTE: We want to clean the url asap so we don't put it in the 
    // evt getter... 
    const urlSearchParam = getStatesFromUrlSearchParams<T>({ name });

    const getEvtXyz = memoize(() => {

        const localStorageKey= `${prefix}${name}`;

        const storeStateInPersistentStorage = !doPersistAcrossReloads ? undefined : (state: T) => localStorage.setItem(localStorageKey, stringify(state));

        const evtXyz = Evt.create(
            (() => {

                if (urlSearchParam.wasPresent) {

                    const { state } = urlSearchParam;

                    storeStateInPersistentStorage?.(state);

                    return state;

                }

                if (doPersistAcrossReloads ) {

                    const serializedState = localStorage.getItem(localStorageKey);

                    if (serializedState !== null) {

                        return parse<T>(serializedState);

                    }

                }

                return typeGuard<() => T>(initialState, typeof initialState === "function") ?
                    initialState() :
                    initialState;

            })()
        );

        //Susceptible to have one handler attached for every component.
        evtXyz.setMaxHandlers(Infinity);

        if (storeStateInPersistentStorage !== undefined) {

            evtXyz.attach(storeStateInPersistentStorage);

        }

        return evtXyz;

    });


    Object.defineProperty(
        globalStates,
        name,
        {
            "enumerable": true,
            "get": () => getEvtXyz().state
        }
    );

    function useXyz() {

        const evtXyz = getEvtXyz();

        useRerenderOnStateChange(evtXyz);

        return {
            [name]: evtXyz.state,
            [`set${capitalize(name)}`]:
                useConstCallback((setStateAction: T | ((prevState: T) => T)) =>
                    evtXyz.state =
                    typeGuard<(prevState: T) => T>(setStateAction, typeof setStateAction === "function") ?
                        setStateAction(evtXyz.state) :
                        setStateAction
                )
        } as any;

    }

    overwriteReadonlyProp(useXyz as any, "name", `use${capitalize(name)}`);

    return Object.defineProperty(
        { [useXyz.name]: useXyz } as any,
        `evt${capitalize(name)}`,
        {
            "enumerable": true,
            "get": () => getEvtXyz()
        }
    );

}



