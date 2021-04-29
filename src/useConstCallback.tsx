

import { useRef, useState } from "react";
import { Parameters } from "evt/tools/typeSafety";


/** https://stackoverflow.com/questions/65890278/why-cant-usecallback-always-return-the-same-ref */
export function useConstCallback<T extends ((...args: never[]) => unknown) | undefined | null>(
    callback: NonNullable<T>
): T {

    const callbackRef = useRef(callback);

    callbackRef.current = callback;

    return useState(() => (...args: Parameters<T>) => callbackRef.current(...args))[0] as T;

}

