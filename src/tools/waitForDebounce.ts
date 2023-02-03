import { Deferred } from "evt/tools/Deferred";
import { createStatefulObservable } from "../tools/StatefulObservable";

export function waitForDebounceFactory(params: { delay: number }) {
    const { delay } = params;

    const obsCurr= createStatefulObservable<{ timer: ReturnType<typeof setTimeout>; startTime: number } | undefined>(()=> undefined);


    function waitForDebounce(): Promise<void | never> {
        const dOut = new Deferred<void | never>();

        const timerCallback = () => {
            obsCurr.current = undefined;
            dOut.resolve();
        };

        if (obsCurr.current !== undefined) {
            clearTimeout(obsCurr.current.timer);

            obsCurr.current.timer = setTimeout(timerCallback, delay - (Date.now() - obsCurr.current.startTime));

            return dOut.pr;
        } else {
            const startTime = Date.now();

            obsCurr.current = {
                "timer": setTimeout(timerCallback, delay),
                startTime,
            };
        }

        return dOut.pr;
    }


    const obsIsDebouncing = createStatefulObservable(()=> false);

    obsCurr.subscribe(curr=> obsIsDebouncing.current = curr !== undefined);

    return { 
        waitForDebounce,
        obsIsDebouncing
    };
}
