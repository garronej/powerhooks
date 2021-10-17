
import { useState } from "react";
import { Evt } from "evt";
import type { StatefulEvt } from "evt";
import { useEvt } from "evt/hooks";
import { useConstCallback } from "./useConstCallback";
import { overwriteReadonlyProp } from "tsafe/lab/overwriteReadonlyProp";
import type { UseNamedStateReturnType } from "./useNamedState";
import { typeGuard } from "tsafe/typeGuard";
import { capitalize } from "./tools/capitalize";
import memoize from "memoizee";
import { addParamToUrl, retrieveAllParamStartingWithPrefixFromUrl, updateSearchBarUrl } from "./tools/urlSearchParams";

export type { StatefulEvt };

export const globalStates: Readonly<Record<string, unknown>> = {};

const persistedGlobalStateNames = new Set<string>();

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
    name: Name,
    /** If function called only if not in local storage */
    initialState: T | (() => T),
    params?: {
        persistance?: false | "localStorage" | "cookie"
    }
): Record<
    `use${Capitalize<Name>}`,
    () => UseNamedStateReturnType<T, Name>
> & Record<
    `evt${Capitalize<Name>}`,
    StatefulEvt<T>
> {

    const { persistance = "localStorage" } = params ?? {};

    const persistentStorage =
        persistance === false ?
            undefined :
            (() => {

                const result = getPersistentStorage({
                    "mechanism": persistance,
                    "key": (() => {

                        if (Object.keys(globalStates).includes(name)) {
                            console.warn(`${name} already in use`);
                        }

                        return `${prefix}${name}`;

                    })()
                });

                if( !result.isSupported ){

                    console.warn([
                        `powerhooks warning, persistance mechanism ${persistance}`,
                        `is not supported by the current runtime, state of ${name}`,
                        `will not be saved`
                    ].join(" "));

                    return undefined;

                }

                return result.persistanceStorage;

            })();


    if (persistentStorage !== undefined) {

        persistedGlobalStateNames.add(name);

    }

    //NOTE: We want to clean the url asap so we don't put it in the 
    // evt getter... but we don't clean it up because powerhooks version clash...TODO
    const urlSearchParam =
        typeof location === "undefined" ?
            { "wasPresent": false as const } :
            getStatesFromUrlSearchParams<T>({ name });

    const getEvtXyz = memoize(() => {

        const storeStateInPersistentStorage =
            persistentStorage == undefined ?
                undefined :
                (state: T) => persistentStorage.setItem(stringify(state))
            ;

        const evtXyz = Evt.create(
            (() => {

                if (urlSearchParam.wasPresent) {

                    const { state } = urlSearchParam;

                    storeStateInPersistentStorage?.(state);

                    return state;

                }

                if (persistentStorage !== undefined) {

                    const serializedState = persistentStorage.getItem();

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

        const [xyz, setXyz] = useState(evtXyz.state);

        useEvt(
            ctx => evtXyz
                .toStateless(ctx)
                .attach(setXyz),
            []
        );

        return {
            [name]: xyz,
            [`set${capitalize(name)}`]:
                useConstCallback((setStateAction: T | ((prevState: T) => T)) =>
                    evtXyz.state =
                    typeGuard<(prevState: T) => T>(setStateAction, typeof setStateAction === "function") ?
                        setStateAction(xyz) :
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




type PersistentStorage = {
    getItem(): string | null;
    setItem(value: string): void;
};

const { getPersistentStorage } = (() => {


    function getLocalStorageImplementationOfPersistantStorage(
        params: {
            key: string;
        }
    ): PersistentStorage {

        const { key } = params;

        return {
            "getItem": () => localStorage.getItem(key),
            "setItem": value => localStorage.setItem(key, value)
        };

    }

    function getCookieImplementationOfPersistantStorage(
        params: {
            key: string;
        }
    ): PersistentStorage {

        const { key } = params;

        return {
            "getItem": () =>
                document.cookie
                    .split("; ")
                    .find(row => row.startsWith(`${key}=`))
                    ?.split("=")?.[1] ?? null,
            "setItem": value => {

                let newCookie = `${key}=${value};path=/;max-age=31536000`;

                //TODO: Use https://dev.to/debosthefirst/how-to-use-cookies-for-persisting-users-in-nextjs-4617?signin=true
                //to make it work with nextJs.
                //We do not set the domain if we are on localhost or an ip
                if (window.location.hostname.match(/\.[a-zA-Z]{2,}$/)) {
                    newCookie += `;domain=${window.location.hostname.split(".").length >= 3 ?
                        window.location.hostname.replace(/^[^.]+\./, "") :
                        window.location.hostname
                        }`;
                }

                document.cookie = newCookie;

            }
        }

    }

    function getPersistentStorage(
        params: {
            key: string;
            mechanism: "localStorage" | "cookie"
        }
    ): { isSupported: false } | { isSupported: true, persistanceStorage: PersistentStorage; } {

        const { key, mechanism } = params;

        switch (mechanism) {
            case "localStorage":
                return typeof localStorage === "undefined" ?
                    { "isSupported": false } :
                    {
                        "isSupported": true,
                        "persistanceStorage": getLocalStorageImplementationOfPersistantStorage({ key })
                    };
            case "cookie":
                return (
                    typeof document === "undefined" ||
                    !(
                        document instanceof Object &&
                        "cookie" in document
                    )
                ) ?
                    { "isSupported": false } :
                    {
                        "isSupported": true,
                        "persistanceStorage": getCookieImplementationOfPersistantStorage({ key })
                    };
        }
    }

    return { getPersistentStorage };


})();