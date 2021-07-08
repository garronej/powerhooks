

import { Evt } from "evt";
import { useEvt } from "evt/hooks/useEvt";
import { useRerenderOnStateChange } from "evt/hooks/useRerenderOnStateChange";

export function useWindowInnerSize() {

	const evtInnerWidth = useEvt(ctx =>
		Evt.from(ctx, window, "resize")
			.toStateful()
			.pipe(() => [{
				"windowInnerWidth": window.innerWidth,
				"windowInnerHeight": window.innerHeight
			}]),
		[]
	);

	useRerenderOnStateChange(evtInnerWidth);

	const { windowInnerWidth, windowInnerHeight } = evtInnerWidth.state;

	return { windowInnerWidth, windowInnerHeight };

}