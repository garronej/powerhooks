import { useEvt } from "./useEvt";
import type { StatefulEvt } from "evt";
import * as React from "react";
const { useState } = React;

/*
type CtxLike<Result = any> = import("evt/lib/types/interfaces/CtxLike").CtxLike<Result>;
interface HandlerLike { ctx: CtxLike };
type Pipe<Cb = () => void> = (ctx: CtxLike, cb?: Cb) => import("evt/lib/Evt.merge").EvtLike<any>;

interface StatefulReadonlyEvtLike {
    state: unknown;
    evtChange: {
        evtAttach: { pipe: Pipe<(handler: HandlerLike) => void>; };
        detach(ctx: CtxLike): void;
        toStateless(ctx: CtxLike): {
            attach(cb: () => void): void;
        }
    };
};
*/

/**
 * https://docs.evt.land/api/react-hooks
 * 
 * To use StatefulEvt as react component state.
 * */
export function useRerenderOnStateChange(evt: StatefulEvt<any>): void {

    const [,setState]=useState<unknown>(evt.state);

    useEvt(
        ctx =>
            evt.attach(ctx, state => setState(state)),
        [evt]
    );
}
