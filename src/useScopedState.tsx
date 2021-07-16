

import type { ReactNode } from "react";
import { useContext, createContext, useMemo } from "react";
import type { UseNamedStateReturnType } from "./useNamedState";
import { capitalize } from "./tools/capitalize";
import { useNamedState } from "./useNamedState";
import { overwriteReadonlyProp } from "tsafe/lab/overwriteReadonlyProp";

/** https://docs.powerhooks.dev/api-reference/usescopedstate */
export function createUseScopedState<T, Name extends string>(
    name: Name,
    initialState: T | (() => T)
): Record<
    `use${Capitalize<Name>}`,
    () => UseNamedStateReturnType<T, Name>
> & Record<
    `${Capitalize<Name>}Provider`,
    (props: {
        children: ReactNode;
        initialState?: T | (() => T);
    }) => JSX.Element
>;
export function createUseScopedState<T, Name extends string>(
    name: Name
): Record<
    `use${Capitalize<Name>}`,
    () => UseNamedStateReturnType<T, Name>
> & Record<
    `${Capitalize<Name>}Provider`,
    (props: {
        children: ReactNode;
        initialState: T | (() => T);
    }) => JSX.Element
>;
export function createUseScopedState<T, Name extends string>(
    name: Name,
    initialState?: T | (() => T)
): any {

    const context = createContext<UseNamedStateReturnType<T, Name> | undefined>(undefined);

    const useXyz = function () {

        const out = useContext(context);

        if (out === undefined) {
            throw new Error(
                `Must be used in a component wrapped in <${capitalize(name)}Provider />`
            );
        }

        return out;

    };

    overwriteReadonlyProp(useXyz as any, "name", `use${capitalize(name)}`);

    const XyzProvider = function (
        props: {
            children: ReactNode;
            initialState?: T | (() => T);
        }
    ) {

        const { children, initialState: initialStateFromProps  } = props;

        const useNamedStateReturnedWrapper = useNamedState(name,(
            initialStateFromProps !== undefined ? 
                initialStateFromProps : initialState
        )!);

        const value = useMemo(
            () => useNamedStateReturnedWrapper,
            [useNamedStateReturnedWrapper[name]]
        );

        return (
            <context.Provider value={value}>
                {children}
            </context.Provider>
        );

    }

    overwriteReadonlyProp(XyzProvider as any, "name", `${capitalize(name)}Provider`);

    return {
        [useXyz.name]: useXyz,
        [XyzProvider.name]: XyzProvider
    };


}
