
import { useMemo, createContext } from "react";
import type { ReactNode } from "react";
import { useState, useRef, useContext, useEffect } from "react";
import { useEvt } from "evt/hooks";
import { useWindowInnerSize } from "./useWindowInnerSize";
import { Evt } from "evt";
import ResizeObserver from "./tools/ResizeObserver";

//TODO: only re-renders when width or height change.

export type PartialDomRect = Pick<DOMRectReadOnly, "bottom" | "right" | "top" | "left" | "height" | "width">;

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

    const { referenceWidth } = useContext(context);

    useEvt(
        ctx => {

            if (htmlElement === null) {
                return;
            }

            Evt.from(ctx, ResizeObserver, htmlElement)
                .toStateful()
                .attach(
                    () => {

                        /*
                        const { ...boundingClientRect } = htmlElement.getBoundingClientRect();
                        if (referenceWidth !== undefined) {
                            (["bottom", "right", "top", "left", "height", "width"] as const)
                                .forEach(key => boundingClientRect[key] = (boundingClientRect[key] / ( window.innerWidth / referenceWidth)));
                        }
                        setDomRect(boundingClientRect);
                        */


                        const { bottom, right, top, left, height, width } = htmlElement.getBoundingClientRect();

                        if (referenceWidth === undefined) {

                            setDomRect({ bottom, right, top, left, height, width });

                        } else {

                            const factor = window.innerWidth / referenceWidth;

                            setDomRect({
                                "bottom": bottom / factor,
                                "right": right / factor,
                                "top": top / factor,
                                "left": left / factor,
                                "height": height / factor,
                                "width": width / factor
                            });

                        }

                    }
                );

        },
        [htmlElement, referenceWidth]
    );

    return { domRect, ref };

}

const context = createContext<{ referenceWidth?: number; }>({});

export type Props = {
    referenceWidth: number | undefined;
    children: ReactNode;
};

export function ZoomProvider(props: Props) {

    const { referenceWidth, children } = props;

    const { windowInnerWidth, windowInnerHeight } = useWindowInnerSize();

    const value = useMemo(() => ({ referenceWidth }), [referenceWidth]);

    const zoomFactor = referenceWidth !== undefined ?
        windowInnerWidth / referenceWidth :
        undefined;

    return (
        <context.Provider value={value}>
            <div
                about={`powerhooks ZoomProvider${zoomFactor === undefined ? " (disabled)" : ""}`}
                style={{
                    "height": "100vh",
                    "overflow": "hidden"
                }}
            >
                {
                    zoomFactor !== undefined ?
                        <div
                            about={`powerhooks ZoomProvider inner`}
                            style={{
                                "transform": `scale(${zoomFactor})`,
                                "transformOrigin": "0 0",
                                "width": referenceWidth,
                                "height": windowInnerHeight / zoomFactor,
                                "overflow": "hidden"
                            }}
                        >
                            {children}
                        </div>
                        :
                        children
                }
            </div>
        </context.Provider>
    );

}
