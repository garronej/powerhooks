import { useState } from "react";
import { Evt } from "evt";
import ResizeObserver from "./ResizeObserver";
import memoize from "memoizee";
import { useConstCallback } from "../useConstCallback";
import { useEvt } from "evt/hooks";
import { useStateRef } from "../useStateRef";

//TODO: only re-renders when width or height change.

export const domRectKeys = ["bottom", "right", "top", "left", "height", "width"] as const;

export type PartialDomRect = Pick<DOMRectReadOnly, typeof domRectKeys[number]>;


// https://gist.github.com/morajabi/523d7a642d8c0a2f71fcfa0d8b3d2846
// https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
export function useDomRect<T extends HTMLElement = any>(): { ref: React.RefObject<T>; domRect: PartialDomRect; checkIfDomRectUpdated: () => void; }
export function useDomRect<T extends HTMLElement = any>(params: { ref: React.RefObject<T>; }): { domRect: PartialDomRect; checkIfDomRectUpdated: () => void; };
export function useDomRect<T extends HTMLElement = any>(params?: { ref: React.RefObject<T>; }): { ref: React.RefObject<T>; domRect: PartialDomRect; checkIfDomRectUpdated: () => void; } {

    const [toMemoPartial] = useState(
        () => memoize(
            (
                bottom: number,
                right: number,
                top: number,
                left: number,
                height: number,
                width: number
            ): PartialDomRect => ({
                bottom, right, top,
                left, height, width
            }),
            { "max": 1 }
        )
    );

    const [domRect, setDomRect] = useState<PartialDomRect>(() => toMemoPartial(0, 0, 0, 0, 0, 0));

    const [evtForceUpdate] = useState(() => Evt.create());

    /** Shouldn't be necessary but hey... */
    const checkIfDomRectUpdated = useConstCallback(
        () => evtForceUpdate.post()
    );

    const internallyCreatedRef = useStateRef<T>(null);

    const ref = params?.ref ?? internallyCreatedRef;

    useEvt(
        ctx => {

            const element = ref.current;

            if( element === null ){
                return;
            }

            ctx.evtDoneOrAborted.setMaxHandlers(Infinity);

            Evt.merge([
                Evt.from(ctx, ResizeObserver, element),
                evtForceUpdate
            ])
                .toStateful()
                .attach(() => (async function callee(previousCallCount: number) {


                    {

                        let timer: ReturnType<typeof setTimeout>;

                        const pr = new Promise(resolve => timer = setTimeout(resolve, 50));

                        const internalCtx = Evt.newCtx();

                        ctx.evtDoneOrAborted.attachOnce(internalCtx, () => clearTimeout(timer));

                        await pr;

                        internalCtx.done();

                    }

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

                    if (previousCallCount < 6) {
                        callee(previousCallCount + 1);
                        return;
                    }

                })(0));

        }
    );

    return { ref, domRect, checkIfDomRectUpdated };

}
