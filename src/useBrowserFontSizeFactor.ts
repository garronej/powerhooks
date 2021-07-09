
import { useBrowserFontSizeFactor as useRealBrowserFontSizeFactor } from "./tools/useBrowserFontSizeFactor";
import { useZoomState } from "./ZoomProvider";

export function useBrowserFontSizeFactor() {

	const { zoomState } = useZoomState();
	const { browserFontSizeFactor } = useRealBrowserFontSizeFactor();

	return {
		"browserFontSizeFactor":
			zoomState !== undefined ?
				zoomState.targetBrowserFontSizeFactor :
				browserFontSizeFactor
	};

}
