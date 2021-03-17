
import { useState } from "react";
import { Evt } from "evt";
import type { StatefulEvt } from "evt";
import { useEvt } from "evt/hooks";
import { useConstCallback } from "./useConstCallback";
import { assert } from "evt/tools/typeSafety/assert";
import { overwriteReadonlyProp } from "evt/tools/typeSafety/overwriteReadonlyProp";
import type { UseNamedStateReturnType } from "./useNamedState";
import { typeGuard } from "evt/tools/typeSafety/typeGuard";
import { capitalize } from "./tools/capitalize";
import memoize from "memoizee";
import { urlSearchParams } from "./tools/urlSearchParams";

export const globalStates: Readonly<Record<string, unknown>> = {};

function stringify(obj: unknown): string {
    return JSON.stringify([obj]);
}

function parse<T>(str: string): T {
    return JSON.parse(str)[0];
}

const { injectGlobalStatesInSearchParams, getStatesFromUrlSearchParams } = (() => {

    const paramPrefix = "powerhooks_useGlobalState_";

    /** Returns the modified url */
    function injectGlobalStatesInSearchParams(url: string): string {

        let newUrl = url;

        Object.keys(globalStates)
            .forEach(name =>
                newUrl = urlSearchParams
                    .add({
                        "url": newUrl,
                        "name": paramPrefix + name,
                        "value": stringify(globalStates[name])
                    })
                    .newUrl
            );

        return newUrl;

    }

    function getStatesFromUrlSearchParams<T>(
        params: { name: string; }
    ): { wasPresent: false; } | { wasPresent: true; state: T; } {

        const { name } = params;

        const popResult = urlSearchParams.pop({
            "locationSearch": window.location.search,
            "name": paramPrefix + name
        });

        if (!popResult.wasPresent) {
            return { "wasPresent": false };
        }

        window.history.replaceState(
            "",
            "",
            `${location.href.split("?")[0]}${popResult.newLocationSearch}`
        );

        return {
            "wasPresent": true,
            "state": parse(popResult.value)
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

    const { persistance = "cookie" } = params ?? {};

    const persistentStorage = persistance === false ?
        undefined :
        getPersistentStorage({
            "mechanism": persistance ?? "localStorage",
            "key": (
                assert(Object.keys(globalStates).indexOf(name) < 0, `${name} already in use`),
                `useGlobalState_${name}`
            )
        });

    const getEvtXyz = memoize(() => {

        const storeStateInPersistentStorage =
            persistentStorage == undefined ?
                undefined :
                (state: T) => persistentStorage.setItem(stringify(state))
            ;

        const evtXyz = Evt.create(
            (() => {

                if (persistentStorage !== undefined) {

                    const serializedState = persistentStorage.getItem();

                    if (serializedState !== null) {

                        return parse<T>(serializedState);

                    }

                }

                const urlSearchParam = getStatesFromUrlSearchParams<T>({ name });

                if (urlSearchParam.wasPresent) {

                    const { state } = urlSearchParam;

                    storeStateInPersistentStorage?.(state);

                    return state;

                }

                return typeGuard<() => T>(initialState, typeof initialState === "function") ?
                    initialState() :
                    initialState;

            })()
        );

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
        { [useXyz.name]: useXyz },
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
    ): PersistentStorage {

        const { key, mechanism } = params;

        switch (mechanism) {
            case "localStorage": return getLocalStorageImplementationOfPersistantStorage({ key });
            case "cookie": return getCookieImplementationOfPersistantStorage({ key });
        }
    }

    return { getPersistentStorage };


})();