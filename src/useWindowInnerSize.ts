
import { useWindowInnerSize as useRealWindowInnerSize } from "./tools/useWindowInnerSize";
import { useViewPortState } from "./ViewPortAdapter";

export function useWindowInnerSize<P extends { isSsrSetup: boolean; }>(
	/** Default: { isSsrSetup: false }, We assume we are in a SPA */
	params?: P
): P extends { isSsrSetup: true; } ? {
	windowInnerWidth: number | undefined;
	windowInnerHeight: number | undefined;
} : {
	windowInnerWidth: number;
	windowInnerHeight: number;
} {

	const { viewPortState } = useViewPortState();
	const { windowInnerWidth, windowInnerHeight } = useRealWindowInnerSize(params);

	return viewPortState !== undefined ?
		{
			"windowInnerWidth": viewPortState.targetWindowInnerWidth,
			"windowInnerHeight": viewPortState.targetWindowInnerHeight
		} : {
			windowInnerWidth, windowInnerHeight
		};

}
