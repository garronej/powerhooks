

import { useState } from "react";
import { Evt } from "evt";
import { useEvt } from "../evt/hooks/useEvt";

export function useWindowInnerSize() {

	const [dimensions, setDimensions] = useState(() => ({
		"windowInnerWidth": window.innerWidth,
		"windowInnerHeight": window.innerHeight
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