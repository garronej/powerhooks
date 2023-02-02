import { Deferred } from "evt/tools/Deferred";

export function waitForDebounceFactory(params: { delay: number }) {
    const { delay } = params;

    let curr: { timer: ReturnType<typeof setTimeout>; startTime: number; } | undefined = undefined;

    function waitForDebounce(): Promise<void | never> {

        const dOut = new Deferred<void | never>();

        const timerCallback = () => {
            curr = undefined;
            dOut.resolve();

        };

        if (curr !== undefined) {

            clearTimeout(curr.timer);

            curr.timer = setTimeout(timerCallback, delay - (Date.now() - curr.startTime));

            return dOut.pr;

        } else {

            const startTime = Date.now();

            curr = {
                "timer": setTimeout(timerCallback, delay),
                startTime
            };

        }

        return dOut.pr;
    }

    return { waitForDebounce };
}

