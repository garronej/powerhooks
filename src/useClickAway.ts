import type { RefObject } from "react";
import { useEvt } from "evt/hooks";
import { Evt } from "evt";
import { useConstCallback } from "./useConstCallback";
import { useStateRef } from "./useStateRef";

export function useClickAway<T extends HTMLElement = any>(params: { onClickAway: () => void; }): { ref: RefObject<T>; };
export function useClickAway<T extends HTMLElement = any>(params: { onClickAway: () => void; ref: RefObject<T>; }): void;
export function useClickAway<T extends HTMLElement = any>(params: { onClickAway: () => void; ref?: RefObject<T>; }): { ref: RefObject<T>; } {

    const { onClickAway } = params;

    const internallyCreatedRef = useStateRef<T>(null);

    const ref = params?.ref ?? internallyCreatedRef;

    const onClickAway_const = useConstCallback(onClickAway);

    useEvt(
        ctx =>
            Evt.from(ctx, document, "mousedown")
                .attach(
                    ({ target }) => !ref.current?.contains(target as any),
                    onClickAway_const
                ),
        []
    );

    return { ref };

}
