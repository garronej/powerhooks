import "minimal-polyfills/Object.fromEntries";
import { useMemo, createContext } from "react";
import type { ReactNode } from "react";
import { useState, useRef, useContext, useEffect } from "react";
import { useEvt } from "evt/hooks";
import { useWindowInnerSize } from "./useWindowInnerSize";
import { Evt } from "evt";
import ResizeObserver from "./tools/ResizeObserver";
import { id } from "tsafe/id";

//TODO: only re-renders when width or height change.

const domRectKeys= ["bottom", "right", "top", "left", "height", "width"] as const;

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

                        const factor = referenceWidth === undefined ? 1 : (referenceWidth / window.innerWidth);

                        setDomRect(
                            Object.fromEntries(
                                Object.entries(htmlElement.getBoundingClientRect())
                                    .filter(([key]) => id<readonly string[]>(domRectKeys).includes(key))
                                    .map(([key, value]) => [key, value * factor])
                            ) as any
                        );

                    }
                );

        },
        [htmlElement, referenceWidth]
    );

    return { domRect, ref };

}

const context = createContext<{ referenceWidth?: number; }>({});

export type ZoomProviderProps = ZoomProviderProps.Enabled | ZoomProviderProps.Disabled;
export declare namespace ZoomProviderProps {

    type WithChildren = {
        children: ReactNode;
    };

    type Enabled = {
        referenceWidth: number;
        /** 
         * Message to display when portrait mode, example: 
         *    This app isn't compatible with landscape mode yet,
         *    please enable the rotation sensor and flip your phone.
         */
        portraitModeUnsupportedMessage?: ReactNode;
    } & WithChildren;

    type Disabled = {
        referenceWidth?: undefined;
    } & WithChildren;

}

export function ZoomProvider(props: ZoomProviderProps) {

    const { referenceWidth, children } = props;

    const { windowInnerWidth, windowInnerHeight } = useWindowInnerSize();

    const { portraitModeUnsupportedMessage } = "portraitModeUnsupportedMessage" in props ?
        props :
        { "portraitModeUnsupportedMessage": undefined };

    const value = useMemo(() => ({ referenceWidth }), [referenceWidth ?? Object]);

    const isDeviceScreenInLandscapeMode = windowInnerWidth > windowInnerHeight;


    const zoomFactor = referenceWidth !== undefined ?
        windowInnerWidth / referenceWidth :
        undefined;

    return (
        <context.Provider value={value}>
            {
                !isDeviceScreenInLandscapeMode && portraitModeUnsupportedMessage !== undefined ?
                    portraitModeUnsupportedMessage :
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
            }
        </context.Provider>
    );

}
