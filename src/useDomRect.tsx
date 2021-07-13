
import { useDomRect as useRealDomRect, domRectKeys } from "./tools/useDomRect";
import type { PartialDomRect } from "./tools/useDomRect";
import { pick } from "./tools/pick";
import { useViewPortState } from "./ViewPortTransformer";

export { PartialDomRect };

export function useDomRect<T extends HTMLElement = any>() {

    const { domRect, ref } = useRealDomRect<T>();
    const { viewPortState } = useViewPortState();

    return {
        ref,
        "domRect": (() => {

            const writableDomRect = pick(
                domRect,
                domRectKeys
            );

            {

                const { zoomFactor } = viewPortState ?? {};

                if (zoomFactor !== undefined) {
                    domRectKeys.forEach(key => writableDomRect[key] /= zoomFactor);
                }

            }

            return writableDomRect;


        })()
    };

}
