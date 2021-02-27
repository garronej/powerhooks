import type { EffectCallback, DependencyList } from "react";
export declare function useEffectButSkipFirstRender(effect: EffectCallback, deps?: DependencyList): void;
