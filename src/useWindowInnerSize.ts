
import { useWindowInnerSize as useWindowAbsoluteInnerSize } from "./tools/useWindowInnerSize";

import { getZoomFactor, useZoomProviderReferenceWidth } from "./ZoomProvider";


/** Takes into account the ZoomProvider */
export function useWindowInnerSize(){

	let { windowInnerWidth, windowInnerHeight, isLandscapeOrientation } = useWindowAbsoluteInnerSize();

	const { referenceWidth } = useZoomProviderReferenceWidth();

	const { zoomFactor } = getZoomFactor({ referenceWidth, windowInnerWidth });

	windowInnerWidth /= zoomFactor;
	windowInnerHeight /= zoomFactor;

	return { windowInnerWidth, windowInnerHeight, isLandscapeOrientation };

}
