
import { useWindowInnerSize as useRealWindowInnerSize } from "./tools/useWindowInnerSize";
import { useViewPortState } from "./ViewPortAdapter";

/** Returns 0 values on the server side */
export function useWindowInnerSize() {

	const { viewPortState } = useViewPortState();
	const { windowInnerWidth, windowInnerHeight } = useRealWindowInnerSize();

	return viewPortState !== undefined ?
		{
			"windowInnerWidth": viewPortState.targetWindowInnerWidth,
			"windowInnerHeight": viewPortState.targetWindowInnerHeight
		} : {
			windowInnerWidth, windowInnerHeight
		};

}
