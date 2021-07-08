import { useState, useRef, useEffect } from "react";
import { useEvt } from "evt/hooks";
import { Evt } from "evt";
import ResizeObserver from "./ResizeObserver";

//TODO: only re-renders when width or height change.

export const domRectKeys = ["bottom", "right", "top", "left", "height", "width"] as const;

export type PartialDomRect = Pick<DOMRectReadOnly, typeof domRectKeys[number]>;

// https://gist.github.com/morajabi/523d7a642d8c0a2f71fcfa0d8b3d2846
// https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
export function useDomRect<T extends HTMLElement = any>() {

    const ref = useRef<T>(null);

    const [domRect, setDomRect] = useState<PartialDomRect>({
        "bottom": 0,
        "right": 0,
        "top": 0,
        "left": 0,
        "height": 0,
        "width": 0
    });

    const [htmlElement, setHtmlElement] = useState<T | null>(null);

    useEffect(
        () => { setHtmlElement(ref.current); },
        [ref.current ?? {}]
    );

    useEvt(
        ctx => {

            if (htmlElement === null) {
                return;
            }

            Evt.from(ctx, ResizeObserver, htmlElement)
                .toStateful()
                .attach(() => setDomRect(htmlElement.getBoundingClientRect()));

        },
        [htmlElement]
    );

    return { domRect, ref };

}
