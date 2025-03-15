import { useConstCallback } from "./useConstCallback";
import { overwriteReadonlyProp } from "tsafe/lab/overwriteReadonlyProp";
import type { UseNamedStateReturnType } from "./useNamedState";
import { typeGuard } from "tsafe/typeGuard";
import { capitalize } from "./tools/capitalize";
import { memoize0 } from "./tools/memoize0";
import { addOrUpdateSearchParam, getAllSearchParamsStartingWithPrefix } from "./tools/urlSearchParams";
import { createStatefulObservable, useRerenderOnChange } from "./tools/StatefulObservable";
import type { StatefulObservable } from "./tools/StatefulObservable";
import { updateSearchBarUrl } from "./tools/updateSearchBar";

export type { StatefulObservable };

const GLOBAL_CONTEXT_KEY = "__powerhooks.useGlobalState.globalContext";

declare global {
    interface Window {
        [GLOBAL_CONTEXT_KEY]: {
            initialLocationHref: string;
            globalStates: Readonly<Record<string, unknown>>;
            persistedGlobalStateNames: Set<string>;
            useGlobalStateWrapperByName: Record<string, Record<string, unknown> | undefined>;
            getUnparsedStatesFromUrlSearchParams_result:
                | { unparsedStates: Record<string, string> }
                | undefined;
        };
    }
}

window[GLOBAL_CONTEXT_KEY] ??= {
    initialLocationHref: window.location.href,
    globalStates: {},
    persistedGlobalStateNames: new Set<string>(),
    useGlobalStateWrapperByName: {},
    getUnparsedStatesFromUrlSearchParams_result: undefined
};

const globalContext = window[GLOBAL_CONTEXT_KEY];

const { initialLocationHref, globalStates, persistedGlobalStateNames } = globalContext;

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
            .forEach(
                name =>
                    (newUrl = addOrUpdateSearchParam({
                        url: newUrl,
                        name: `${prefix}${name}`,
                        value: stringify(globalStates[name]),
                        encodeMethod: "encodeURIComponent"
                    }))
            );

        return newUrl;
    }

    function getUnparsedStatesFromUrlSearchParams() {
        if (globalContext.getUnparsedStatesFromUrlSearchParams_result !== undefined) {
            return globalContext.getUnparsedStatesFromUrlSearchParams_result;
        }

        const doLeavePrefixInResults = false;

        const { valueByName: values } = getAllSearchParamsStartingWithPrefix({
            url: initialLocationHref,
            prefix,
            doLeavePrefixInResults
        });

        if (Object.keys(values).length !== 0) {
            // NOTE: We have to re-extract here since the href might have been updated
            // while we were waiting for the timeout to be executed.
            const { url_withoutTheParams } = getAllSearchParamsStartingWithPrefix({
                url: window.location.href,
                prefix,
                doLeavePrefixInResults
            });

            updateSearchBarUrl(url_withoutTheParams);
        }

        return (globalContext.getUnparsedStatesFromUrlSearchParams_result = {
            unparsedStates: values
        });
    }

    function getStatesFromUrlSearchParams<T>(params: {
        name: string;
    }): { wasPresent: false } | { wasPresent: true; state: T } {
        const { name } = params;

        const { unparsedStates } = getUnparsedStatesFromUrlSearchParams();

        if (!(name in unparsedStates)) {
            return { wasPresent: false };
        }

        return {
            wasPresent: true,
            state: parse(unparsedStates[name])
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
 * By default persistence is enabled using localStorage.
 *
 */
export function createUseGlobalState<T, Name extends string>(params: {
    name: Name;
    /** If function called only if not in local storage */
    initialState: T | (() => T);
    doPersistAcrossReloads: boolean;
}): Record<`use${Capitalize<Name>}`, () => UseNamedStateReturnType<T, Name>> &
    Record<`$${Name}`, StatefulObservable<T>> {
    const { name, initialState, doPersistAcrossReloads } = params;

    use_cache: {
        const cache = globalContext.useGlobalStateWrapperByName[name];

        if (cache === undefined) {
            break use_cache;
        }

        // @ts-expect-error: We know what we're doing.
        return cache;
    }

    if (doPersistAcrossReloads) {
        persistedGlobalStateNames.add(name);
    }

    //NOTE: We want to clean the url asap so we don't put it in the
    // evt getter...
    const urlSearchParam = getStatesFromUrlSearchParams<T>({ name });

    const get$xyz = memoize0(() => {
        const localStorageKey = `${prefix}${name}`;

        const storeStateInPersistentStorage = !doPersistAcrossReloads
            ? undefined
            : (state: T) => {
                  localStorage.setItem(localStorageKey, stringify(state));
              };

        const $xyz = createStatefulObservable<T>(
            (() => {
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

                    return typeGuard<() => T>(initialState, typeof initialState === "function")
                        ? initialState()
                        : initialState;
                })();

                return () => initialValue;
            })()
        );

        if (storeStateInPersistentStorage !== undefined) {
            $xyz.subscribe(storeStateInPersistentStorage);
        }

        return $xyz;
    });

    Object.defineProperty(globalStates, name, {
        enumerable: true,
        get: () => get$xyz().current,
        configurable: true
    });

    function useXyz() {
        const $xyz = get$xyz();

        useRerenderOnChange($xyz);

        return {
            [name]: $xyz.current,
            [`set${capitalize(name)}`]: useConstCallback(
                (setStateAction: T | ((prevState: T) => T)) =>
                    ($xyz.current = typeGuard<(prevState: T) => T>(
                        setStateAction,
                        typeof setStateAction === "function"
                    )
                        ? setStateAction($xyz.current)
                        : setStateAction)
            )
        } as any;
    }

    overwriteReadonlyProp(useXyz as any, "name", `use${capitalize(name)}`);

    const cache = Object.defineProperty({ [useXyz.name]: useXyz } as any, `$${name}`, {
        enumerable: true,
        get: () => get$xyz()
    });

    globalContext.useGlobalStateWrapperByName[name] = cache;

    return cache;
}
