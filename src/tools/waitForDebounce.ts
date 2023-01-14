import { Deferred } from "evt/tools/Deferred";
import { assert } from "tsafe/assert";

export function waitForDebounceFactory(params: { delay: number }) {
    const { delay } = params;

    let d: Deferred<void | never> | undefined = undefined;

    function waitForDebounce(): Promise<void | never> {

        if (d !== undefined) {
            return new Promise<void>(() => { /* Never resolve */ });
        }

        d = new Deferred();

        setTimeout(() => {
            assert(d !== undefined);
            d.resolve();
            d = undefined;
        }, delay);

        return d.pr;
    }

    return { waitForDebounce };
}
