import type React from "react";
export declare type ReactMouseEvent = React.MouseEvent<HTMLElement, MouseEvent>;
declare type OnMouseUpOrDown = (mouseEvent: ReactMouseEvent) => void;
/**
 * Why not use onDoubleClick?
 * Because it down is fired event when a double click is pending.
 * NOTE: callback does not need to be constant.
 */
export declare function useClick<ExtraArg>(params: {
    doubleClickDelayMs: number;
    callback(params: {
        type: "down" | "double";
        mouseEvent: ReactMouseEvent;
        extraArg: ExtraArg;
    }): void;
}): {
    getOnMouseProps: (extraArg: ExtraArg) => {
        onMouseDown: OnMouseUpOrDown;
        onMouseUp: OnMouseUpOrDown;
    };
};
export {};
