

import { useState } from "react";
import { Evt } from "evt";
import { useEvt } from "evt/hooks/useEvt";
import { isBrowser } from "./isBrowser";

/** Returns 0 values on the server side */
export function useWindowInnerSize() {

	const [dimensions, setDimensions] = useState(() => ({
		"windowInnerWidth": !isBrowser ? 0 : window.innerWidth,
		"windowInnerHeight": !isBrowser ? 0 : window.innerHeight
	}));

	useEvt(ctx =>
		Evt.from(ctx, window, "resize")
			.attach(() => setDimensions({
				"windowInnerWidth": window.innerWidth,
				"windowInnerHeight": window.innerHeight
			})),
		[]
	);

	return dimensions;



}