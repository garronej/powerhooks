import { Evt } from "evt";
import type { Ctx } from "evt";
import * as React from "react";
import { useEffect } from "react";


/**
 * https://docs.evt.land/api/react-hooks
 * 
 * Provide a Ctx to attach handlers.
 * You should list in deps all the Evt that are
 * susceptible to change ( Evt passed as props 
 * or Evt that are react states ) that you use in the
 * factoryOrEffect callback. 
 * As for useEffect you should also list every other
 * value that you use.
 * Whenever any value in deps is changed factoryOrEffect
 * is invoked again with the new Evt and the previous handler
 * get detached.
 * All handler are also detached when the component unmount.
 * 
 * factoryOrEffect can be used for attaching handler to event
 * or to generate a new event that is a merge/pipe of other 
 * Evts.
 * 
 * BE AWARE: Unlike useEffect factoryOrEffect is called 
 * on render ( like useMemo's callback ).
 * Remember that you shouldn't update state in a component 
 * render tick (in the useMemo for example). If you you need to 
 * perform an effect on first render (attaching a stateful evt
 * for example) use registerSideEffect(()=>{ ... })
 * 
 * Demo: https://stackblitz.com/edit/evt-useevt?file=index.tsx
 */
export function useEvt(
    effect: (ctx: Ctx) => void,
    deps: React.DependencyList
): void {

    useEffect(
        ()=> {
            const ctx= Evt.newCtx();

            effect(ctx);

            return ()=> { ctx.done; };
        },
        deps
    )

}
