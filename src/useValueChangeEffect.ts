import { useEffect, useRef } from "react";
import type { EffectCallback, DependencyList } from "react";

export function useValueChangeEffect<T extends readonly [value: any, ...moreValues: any[]]>(
    effect: (...args: T) => void,
    values: T
): void {

    useEffectButSkipFirstRender(() => {

        effect(...values);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, values);

}

function useEffectButSkipFirstRender(effect: EffectCallback, deps?: DependencyList): void {

    const refIsFistRender = useRef(true);

    useEffect(() => {

        if (refIsFistRender.current) {
            refIsFistRender.current = false;
            return;
        }

        return effect();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

}
