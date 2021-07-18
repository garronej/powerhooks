import { useState } from "react";
import { Evt } from "evt";
import ResizeObserver from "./ResizeObserver";
import memoize from "memoizee";
import { useConstCallback } from "../useConstCallback";
import { useElementEvt } from "evt/hooks";

//TODO: only re-renders when width or height change.

export const domRectKeys = ["bottom", "right", "top", "left", "height", "width"] as const;

export type PartialDomRect = Pick<DOMRectReadOnly, typeof domRectKeys[number]>;

const toMemoPartial = memoize(
    (
        bottom: number,
        right: number,
        top: number,
        left: number,
        height: number,
        width: number
    ): PartialDomRect => ({
        bottom, right, top, left, height, width
    }),
    { "max": 1 }
);

// https://gist.github.com/morajabi/523d7a642d8c0a2f71fcfa0d8b3d2846
// https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
export function useDomRect<T extends HTMLElement = any>() {

    const [domRect, setDomRect] = useState<PartialDomRect>(() => toMemoPartial(0, 0, 0, 0, 0, 0));

    const [evtForceUpdate] = useState(() => Evt.create());

    /** Shouldn't be necessary but hey... */
    const checkIfDomRectUpdated = useConstCallback(
        () => evtForceUpdate.post()
    );

    const { ref } = useElementEvt<T>(
        ({ ctx, element }) =>
            Evt.merge([
                Evt.from(ctx, ResizeObserver, element),
                evtForceUpdate
            ])
                .toStateful()
                .attach(() => {

                    const {
                        bottom, right, top,
                        left, height, width
                    } = element.getBoundingClientRect();

                    setDomRect(
                        toMemoPartial(
                            bottom, right, top,
                            left, height, width
                        )
                    );

                }),
        []
    );

    return { domRect, ref, checkIfDomRectUpdated };

}
