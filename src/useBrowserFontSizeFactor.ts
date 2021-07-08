
import {
	useBrowserFontSizeFactor as useRealBrowserFontSizeFactor,
	getBrowserFontSizeFactor as getRealBrowserFontSizeFactor
} from "./tools/useBrowserFontSizeFactor";

import { useZoomState, evtZoomState } from "./ZoomProvider";
import type { ZoomState } from "./ZoomProvider";

function pure(
	params: {
		zoomState: ZoomState | undefined;
		browserFontSizeFactor: number;
	}
) {

	const { zoomState, browserFontSizeFactor } = params;

	return {
		"browserFontSizeFactor":
			zoomState !== undefined ?
				zoomState.targetBrowserFontSizeFactor :
				browserFontSizeFactor
	};

}

export function useBrowserFontSizeFactor() {

	const { zoomState } = useZoomState();
	const { browserFontSizeFactor } = useRealBrowserFontSizeFactor();

	return pure({ zoomState, browserFontSizeFactor });

}

export function getBrowserFontSizeFactor() {

	const { browserFontSizeFactor } = pure({
		"zoomState": evtZoomState.state,
		"browserFontSizeFactor": getRealBrowserFontSizeFactor()
	});

	return browserFontSizeFactor;

}