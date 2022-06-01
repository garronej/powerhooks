
import { useMemo, useEffect } from "react";
import { useDomRect as useRealDomRect, domRectKeys } from "./tools/useDomRect";
import type { PartialDomRect } from "./tools/useDomRect";
import { pick } from "./tools/pick";
import { useViewPortState } from "./ViewPortAdapter";
import { useStateRef } from "./useStateRef";
import { id } from "tsafe/id";

export { PartialDomRect };

export function useDomRect<T extends HTMLElement = any>(): { ref: React.RefObject<T>; domRect: PartialDomRect }
export function useDomRect<T extends HTMLElement = any>(params: { ref: React.RefObject<T>; }): { domRect: PartialDomRect; };
export function useDomRect<T extends HTMLElement = any>(params?: { ref: React.RefObject<T>; }): { ref: React.RefObject<T>; domRect: PartialDomRect; } {

    const internallyCreatedRef = useStateRef<T>(null);

    const ref = params?.ref ?? internallyCreatedRef;

    const { domRect, checkIfDomRectUpdated } = useRealDomRect<T>({ ref });

    const { zoomFactor } = (function useClosure() {

        const { viewPortState } = useViewPortState();

        const { zoomFactor } = viewPortState ?? {};

        return { zoomFactor };

    })();

    useEffect(
        () => { checkIfDomRectUpdated(); },
        [zoomFactor ?? Object]
    );

    const fixedDomRect = useMemo(
        () => {

            const writableDomRect = pick(
                domRect,
                domRectKeys
            );

            if (zoomFactor !== undefined) {
                domRectKeys.forEach(key => writableDomRect[key] /= zoomFactor);
            }

            return id<PartialDomRect>(writableDomRect);

        },
        [domRect, zoomFactor ?? Object]
    );

    return { ref, "domRect": fixedDomRect };

}
