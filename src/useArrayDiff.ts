import { useState, useEffect } from "react";
import { Evt } from "evt";
import { useEvt } from "evt/hooks";
import { arrDiff } from "evt/tools/reducers/diff";
import { useConstCallback } from "./useConstCallback";

export type UseArrayDiffCallbackParams<ArrOf> = {
    added: ArrOf[];
    removed: ArrOf[];
};

/** 
 * NOTE: Callback does not need to be constant.
 * WARNING: This hooks will only works with arrays that changes refs when updated.
 * */
export function useArrayDiff<ArrOf>(
    params: {
        watchFor: "addition";
        array: ArrOf[],
        callback(params: Pick<UseArrayDiffCallbackParams<ArrOf>, "added">): void;
    }
): void;
export function useArrayDiff<ArrOf>(
    params: {
        watchFor: "deletion";
        array: ArrOf[],
        callback(params: Pick<UseArrayDiffCallbackParams<ArrOf>, "removed">): void;
    }
): void;
export function useArrayDiff<ArrOf>(
    params: {
        watchFor: "addition or deletion";
        array: ArrOf[],
        callback(params: UseArrayDiffCallbackParams<ArrOf>): void;
    }
): void;
export function useArrayDiff<ArrOf>(
    params: {
        watchFor?: "addition" | "deletion" | "addition or deletion";
        array: ArrOf[],
        callback(params: UseArrayDiffCallbackParams<ArrOf>): void;
    }
): void {

    const { watchFor, array, callback } = params

    const constCallback = useConstCallback(callback);


    const [evtArray] = useState(() => Evt.create(array));

    useEffect(
        () => { evtArray.state= [...array]; },
        [array]
    );


    useEvt(
        ctx => evtArray
            .evtDiff
            .pipe(ctx, ({ prevState, newState }) => [arrDiff(prevState, newState)])
            .attach(({ added, removed }) => {

                switch (watchFor) {
                    case "addition":
                        if (added.length === 0) {
                            return;
                        }
                        break;
                    case "deletion":
                        if (removed.length === 0) {
                            return;
                        }
                        break;
                    case "addition or deletion":
                        if (
                            removed.length === 0 &&
                            added.length === 0
                        ) {
                            return;
                        }
                        break;
                }

                constCallback({
                    "added": [...added],
                    "removed": [...removed]
                });


            }),
        [evtArray, watchFor]
    );


}




