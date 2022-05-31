

import { Evt } from "evt";
import { Reflect } from "tsafe/Reflect";
import { StatefulEvt } from "evt";

export function createLazilyInitializedStatefulEvt<T>(
	getInitialState: ()=> T
): StatefulEvt<T> {

	const evt = Evt.create(Reflect<T>());

	let wrapState: [T] | undefined = undefined;

	Object.defineProperty(
		evt,
		"__state",
		{
			"enumerable": false,
			"get": ()=> {
				if( wrapState === undefined ){
					wrapState = [getInitialState()];
				}
				return wrapState[0];
			},
			"set": (state: T)=> wrapState= [state]
		}
	);

	return evt;

}