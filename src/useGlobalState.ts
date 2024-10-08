
import { createContext } from "react";
import { useConstCallback } from "./useConstCallback";
import { overwriteReadonlyProp } from "tsafe/lab/overwriteReadonlyProp";
import type { UseNamedStateReturnType } from "./useNamedState";
import { typeGuard } from "tsafe/typeGuard";
import { capitalize } from "./tools/capitalize";
import { memoize0 } from "./tools/memoize0";
import { addParamToUrl, retrieveAllParamStartingWithPrefixFromUrl, updateSearchBarUrl } from "./tools/urlSearchParams";
import { createStatefulObservable, useRerenderOnChange } from "./tools/StatefulObservable";
import type { StatefulObservable } from "./tools/StatefulObservable";

export type { StatefulObservable };

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

    const getUnparsedStatesFromUrlSearchParams = memoize0(() => {

        const doLeavePrefixInResults = false;

        const { values } = retrieveAllParamStartingWithPrefixFromUrl({
            "url": window.location.href,
            prefix,
            doLeavePrefixInResults,
        });

        remove_query_params_from_url: {

            if (Object.keys(values).length === 0) {
                break remove_query_params_from_url;
            }

            //NOTE: We use a timeout in case there is multiple instances of 
            // powerhooks.
            setTimeout(() => {

                // NOTE: We have to re-extract here since the href might have been updated
                // while we were waiting for the timeout to be executed.
                const { newUrl } = retrieveAllParamStartingWithPrefixFromUrl({
                    "url": window.location.href,
                    prefix,
                    doLeavePrefixInResults,
                });

                updateSearchBarUrl(newUrl);

            }, 0);

        }

        return { "unparsedStates": values };

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



const hotReloadCleanup = new Map<string, () => void>();

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
    `$${Name}`,
    StatefulObservable<T>
> {

    const { name, initialState, doPersistAcrossReloads } = params;


    let isActive = true;

    {
        const cleanup = hotReloadCleanup.get(name);

        cleanup?.();

        hotReloadCleanup.set(name, () => { isActive = false; });
    }


    if (doPersistAcrossReloads) {

        persistedGlobalStateNames.add(name);

    }

    //NOTE: We want to clean the url asap so we don't put it in the 
    // evt getter... 
    const urlSearchParam = getStatesFromUrlSearchParams<T>({ name });

    const get$xyz = memoize0(() => {

        const localStorageKey = `${prefix}${name}`;

        const storeStateInPersistentStorage = !doPersistAcrossReloads ? undefined : (state: T) => {

            if (!isActive) {
                return;
            }

            localStorage.setItem(localStorageKey, stringify(state));
        };


        const $xyz = createStatefulObservable<T>((() => {

            const initialValue = (() => {

                if (urlSearchParam.wasPresent) {

                    const { state } = urlSearchParam;

                    storeStateInPersistentStorage?.(state);

                    return state;

                }

                if (doPersistAcrossReloads) {

                    const serializedState = localStorage.getItem(localStorageKey);

                    if (serializedState !== null) {

                        return parse<T>(serializedState);

                    }

                }

                return typeGuard<() => T>(initialState, typeof initialState === "function") ?
                    initialState() :
                    initialState;

            })();

            return () => initialValue;

        })());


        if (storeStateInPersistentStorage !== undefined) {

            $xyz.subscribe(storeStateInPersistentStorage);

        }

        return $xyz;

    });


    Object.defineProperty(
        globalStates,
        name,
        {
            "enumerable": true,
            "get": () => get$xyz().current,
            "configurable": true
        }
    );

    function useXyz() {

        const $xyz = get$xyz();

        useRerenderOnChange($xyz);

        return {
            [name]: $xyz.current,
            [`set${capitalize(name)}`]:
                useConstCallback((setStateAction: T | ((prevState: T) => T)) =>
                    $xyz.current =
                    typeGuard<(prevState: T) => T>(setStateAction, typeof setStateAction === "function") ?
                        setStateAction($xyz.current) :
                        setStateAction
                )
        } as any;

    }

    overwriteReadonlyProp(useXyz as any, "name", `use${capitalize(name)}`);

    return Object.defineProperty(
        { [useXyz.name]: useXyz } as any,
        `$${name}`,
        {
            "enumerable": true,
            "get": () => get$xyz()
        }
    );

}



