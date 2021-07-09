
import { useDomRect as useRealDomRect, domRectKeys } from "./tools/useDomRect";
import type { PartialDomRect } from "./tools/useDomRect";
import { pick } from "./tools/pick";
import { useZoomState } from "./ZoomProvider";

export { PartialDomRect };

export function useDomRect<T extends HTMLElement = any>() {

    const { domRect, ref } = useRealDomRect<T>();
    const { zoomState } = useZoomState();

    return {
        ref,
        "domRect": (() => {

            const writableDomRect = pick(
                domRect,
                domRectKeys
            );

            {

                const { zoomFactor } = zoomState ?? {};

                if (zoomFactor !== undefined) {
                    domRectKeys.forEach(key => writableDomRect[key] /= zoomFactor);
                }

            }

            return writableDomRect;


        })()
    };

}
