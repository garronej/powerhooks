import { useState, useEffect } from "react";
import { assert } from "tsafe/assert";
import { useDomRect } from "./useDomRect";
import { getScrollableParent } from "./getScrollableParent";
import { useStateRef } from "./useStateRef";

export function useStickyTop<T extends HTMLElement = any>(): { ref: React.RefObject<T>; top: number | undefined; }
export function useStickyTop<T extends HTMLElement = any>(params: { ref: React.RefObject<T>; }): { top: number | undefined; };
export function useStickyTop<T extends HTMLElement = any>(params?: { ref: React.RefObject<T>; }): { ref: React.RefObject<T>; top: number | undefined; } {

    const internallyCreatedRef = useStateRef<T>(null);

    const ref = params?.ref ?? internallyCreatedRef;

    const {
        domRect: { top: topSticky },
    } = useDomRect<T>({ ref });

    const [top, setTop] = useState<number | undefined>(undefined);

    useEffect(() => {
        /*
            if (top !== undefined) {
                return;
            }
            */
        if (topSticky === 0) {
            return;
        }

        const element = ref.current;

        assert(element !== null);

        const { top: topScrollable } = getScrollableParent({
            "element": element,
            "doReturnElementIfScrollable": false
        }).getBoundingClientRect();

        setTop(topSticky - topScrollable);
    }, [topSticky]);

    return { top, ref };

}
