
import { useWindowInnerSize as useRealWindowInnerSize } from "./tools/useWindowInnerSize";

import { useZoomState, evtZoomState } from "./ZoomProvider";
import type { ZoomState } from "./ZoomProvider";

function pure(
	props: {
		zoomState: ZoomState | undefined;
		windowInnerWidth: number;
		windowInnerHeight: number;
	}
) {

	const {
		zoomState,
		windowInnerWidth,
		windowInnerHeight
	} = props;

	return zoomState !== undefined ?
		{
			"windowInnerWidth": zoomState.targetWindowInnerWidth,
			"windowInnerHeight": zoomState.targetWindowInnerHeight
		} : {
			windowInnerWidth, windowInnerHeight
		};

}

export function useWindowInnerSize() {

	const { zoomState } = useZoomState();
	const { windowInnerWidth, windowInnerHeight } = useRealWindowInnerSize();

	return pure({ zoomState, windowInnerWidth, windowInnerHeight });

}

/** ...computed according to the ZoomProvider */
export function getWindowInnerSize() {
	return pure({
		"zoomState": evtZoomState.state,
		"windowInnerHeight": window.innerHeight,
		"windowInnerWidth": window.innerWidth
	});
}
