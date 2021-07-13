
import { useWindowInnerSize as useRealWindowInnerSize } from "./tools/useWindowInnerSize";
import { useViewPortState } from "./ViewPortTransformer";


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
