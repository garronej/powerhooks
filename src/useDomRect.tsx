import { useState } from "react";
import { Evt } from "evt";
import { useEvt } from "evt/hooks";
import { useStateRef } from "./useStateRef";
import { id } from "tsafe/id";
import { same } from "evt/tools/inDepth/same";

//TODO: only re-renders when width or height change.

export const domRectKeys = ["bottom", "right", "top", "left", "height", "width"] as const;

export type PartialDomRect = Pick<DOMRectReadOnly, typeof domRectKeys[number]>;

// https://gist.github.com/morajabi/523d7a642d8c0a2f71fcfa0d8b3d2846
// https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
export function useDomRect<T extends HTMLElement = any>(): { ref: React.RefObject<T>; domRect: PartialDomRect; }
export function useDomRect<T extends HTMLElement = any>(params: { ref: React.RefObject<T>; }): { domRect: PartialDomRect; };
export function useDomRect<T extends HTMLElement = any>(params?: { ref: React.RefObject<T>; }): { ref: React.RefObject<T>; domRect: PartialDomRect; } {

    const ref = (function useClosure() {

        const internallyCreatedRef = useStateRef<T>(null);

        return params?.ref ?? internallyCreatedRef;

    })();

    const [domRect, setDomRect] = useState<PartialDomRect>({
        "bottom": 0,
        "right": 0,
        "top": 0,
        "left": 0,
        "height": 0,
        "width": 0
    });

    useEvt(
        ctx => {

            const element = ref.current;

            if (element === null) {
                return;
            }

            Evt.from(ctx, ResizeObserver, element)
                .toStateful()
                .pipe(() => {
                    const { bottom, right, top, left, height, width } = element.getBoundingClientRect();
                    return [id<PartialDomRect>({ bottom, right, top, left, height, width })];
                })
                .attach(domRect => setDomRect(currentDomRect => same(currentDomRect, domRect) ? currentDomRect : domRect));

        },
        [ref.current]
    );

    return { ref, domRect };

}