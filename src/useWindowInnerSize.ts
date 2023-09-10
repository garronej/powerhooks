

import { useState } from "react";
import { Evt } from "evt";
import { useEvt } from "evt/hooks/useEvt";
import { isBrowser } from "./tools/isBrowser";
import { assert } from "tsafe/assert";
import { symToStr } from "tsafe/symToStr";
import { same } from "evt/tools/inDepth/same";

export function useWindowInnerSize<P extends { isSsrSetup: boolean; }>(
	/** Default: { isSsrSetup: false }, We assume we are in a SPA */
	params?: P
): P extends { isSsrSetup: true; } ? {
	windowInnerWidth: number | undefined;
	windowInnerHeight: number | undefined;
}: {
	windowInnerWidth: number;
	windowInnerHeight: number;
} {

	const { isSsrSetup = false } = params ?? {};

	const [dimensions, setDimensions] = useState(() =>
		isSsrSetup ?
			{
				"windowInnerWidth": undefined,
				"windowInnerHeight": undefined
			} :
			(assert(isBrowser, `${symToStr({ useWindowInnerSize })} should be used in SSR mode`), {
				"windowInnerWidth": window.innerWidth,
				"windowInnerHeight": window.innerHeight
			})
	);

	useEvt(ctx =>
		Evt.from(ctx, window, "resize")
			.attach(() => {
				const dimensions= {
					"windowInnerWidth": window.innerWidth,
					"windowInnerHeight": window.innerHeight
				};
				setDimensions(currentDimensions => same(currentDimensions, dimensions) ? currentDimensions : dimensions);
			}),
		[]
	);

	//@ts-expect-error
	return dimensions;

}