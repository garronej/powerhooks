
import { useBrowserFontSizeFactor as useRealBrowserFontSizeFactor } from "./tools/useBrowserFontSizeFactor";
import { useViewPortState } from "./ViewPortAdapter";

export function useBrowserFontSizeFactor() {

	const { viewPortState } = useViewPortState();
	const { browserFontSizeFactor } = useRealBrowserFontSizeFactor();

	return {
		"browserFontSizeFactor":
			viewPortState !== undefined ?
				viewPortState.targetBrowserFontSizeFactor :
				browserFontSizeFactor
	};

}
