import type { MutableRefObject, RefObject } from "react";
import { useConst } from "./useConst";
import { Evt } from "evt";
import { useRerenderOnStateChange } from "evt/hooks/useRerenderOnStateChange";

//NOTE: It's like useRef but when the value changes, it will trigger a re-render (hence ref.current is a state of the component).

export function useStateRef<T>(initialValue: T): MutableRefObject<T>;
export function useStateRef<T>(initialValue: T|null): RefObject<T>;
export function useStateRef<T>(initialValue: T|null): MutableRefObject<T>{

    const evtElement = useConst(() => Evt.create<T | null>(initialValue));

    useRerenderOnStateChange(evtElement);

    const { ref } = useConst(() => {

        const ref: MutableRefObject<T> = {} as any;

        Object.defineProperty(ref, "current", {
            "get": ()=> evtElement.state,
            "set": (current: T | null)=> evtElement.state = current
        });

        return { ref };

    });

    return ref;

}