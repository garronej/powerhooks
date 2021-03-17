import type { ReactNode } from "react";
import type { UseNamedStateReturnType } from "./useNamedState";
/** https://docs.powerhooks.dev/api-reference/usescopedstate */
export declare function createUseScopedState<T, Name extends string>(name: Name, initialState: T | (() => T)): Record<`use${Capitalize<Name>}`, () => UseNamedStateReturnType<T, Name>> & Record<`${Capitalize<Name>}Provider`, (props: {
    children: ReactNode;
    initialState?: T | (() => T);
}) => JSX.Element>;
export declare function createUseScopedState<T, Name extends string>(name: Name): Record<`use${Capitalize<Name>}`, () => UseNamedStateReturnType<T, Name>> & Record<`${Capitalize<Name>}Provider`, (props: {
    children: ReactNode;
    initialState: T | (() => T);
}) => JSX.Element>;
