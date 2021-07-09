
import { useWindowInnerSize as useRealWindowInnerSize } from "./tools/useWindowInnerSize";
import { useZoomState } from "./ZoomProvider";


export function useWindowInnerSize() {

	const { zoomState } = useZoomState();
	const { windowInnerWidth, windowInnerHeight } = useRealWindowInnerSize();

	return zoomState !== undefined ?
		{
			"windowInnerWidth": zoomState.targetWindowInnerWidth,
			"windowInnerHeight": zoomState.targetWindowInnerHeight
		} : {
			windowInnerWidth, windowInnerHeight
		};

}
