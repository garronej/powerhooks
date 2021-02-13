import * as React from "react";
import type { ReactNode } from "react";
export declare type PartialDomRect = Pick<DOMRectReadOnly, "bottom" | "right" | "top" | "left" | "height" | "width">;
export declare function useDomRect<T extends HTMLElement = any>(): {
    domRect: Pick<DOMRectReadOnly, "bottom" | "left" | "right" | "top" | "height" | "width">;
    ref: React.RefObject<T>;
};
export declare type Props = {
    referenceWidth: number | undefined;
    children: ReactNode;
};
export declare function ZoomProvider(props: Props): JSX.Element;
