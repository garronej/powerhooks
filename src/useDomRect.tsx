
import { useDomRect as useRealDomRect, domRectKeys } from "./tools/useDomRect";
import type { PartialDomRect } from "./tools/useDomRect";
import { evtZoomState } from "./ZoomProvider";
import { pick } from "./tools/pick";

export { PartialDomRect };

export function useDomRect<T extends HTMLElement = any>() {

    const { domRect, ref } = useRealDomRect<T>();

    return {
        ref,
        "domRect": (() => {

            const writableDomRect = pick(
                domRect,
                domRectKeys
            );

            {

                const { zoomFactor } = evtZoomState.state ?? {};

                if (zoomFactor !== undefined) {
                    domRectKeys.forEach(key => writableDomRect[key] /= zoomFactor);
                }

            }

            return writableDomRect;


        })()
    };

}
