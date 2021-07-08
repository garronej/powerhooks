

import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useWindowInnerSize as useRealWindowInnerSize } from "./tools/useWindowInnerSize";
import { useBrowserFontSizeFactor as useRealBrowserFontSizeFactor } from "./tools/useBrowserFontSizeFactor";
import { createUseGlobalState } from "./useGlobalState";
import { id } from "tsafe/id";

export type ZoomConfig = {
	targetWindowInnerWidth: number;
	targetWindowInnerHeight?: number;
	targetBrowserFontSizeFactor: number;
	fallbackNode?: ReactNode;
};

export type ZoomProviderProps = {
	getConfig(
		props: {
			windowInnerWidth: number;
			browserFontSizeFactor: number;
		}
	): ZoomConfig;
	children: ReactNode;
};

export type ZoomState = ZoomConfig & {
	targetWindowInnerHeight: number;
	zoomFactor: number;
};

export const { useZoomState, evtZoomState } = createUseGlobalState(
	"zoomState",
	id<ZoomState | undefined>(undefined),
	{ "persistance": false }
);

/**
 * WARNING: We assumes that html element font-size is not defined
 * or defined in percentages.
 */
export function ZoomProvider(props: ZoomProviderProps) {

	const { getConfig, children } = props;

	const {
		windowInnerWidth,
		windowInnerHeight,
	} = useRealWindowInnerSize();

	const { browserFontSizeFactor } = useRealBrowserFontSizeFactor();

	const { zoomState } = useMemo(
		() => {

			const zoomConfig = getConfig({ windowInnerWidth, browserFontSizeFactor });

			const zoomFactor = windowInnerWidth / zoomConfig.targetWindowInnerWidth;

			const zoomState: ZoomState = {
				...zoomConfig,
				zoomFactor,
				"targetWindowInnerHeight":
					zoomConfig.targetWindowInnerHeight ??
					(windowInnerHeight / zoomFactor)
			};

			evtZoomState.state = zoomState;

			return { zoomState };

		},
		[windowInnerWidth, windowInnerHeight, browserFontSizeFactor]
	);

	useEffect(
		() => {

			//NOTE: We assert the font size is defined in percent 
			//or not defined. We have no way to check it so we make
			//it a requirement to use the zoom provider.

			const rootElement = document.querySelector("html")!;

			const rootElementFontSizePx =
				parseInt(
					window.getComputedStyle(rootElement, null)
						.getPropertyValue("font-size")
						.replace(/px$/, "")
				);

			//Cross multiplication
			//100     						16 * browserFontSizeFactor;
			//rootElementFontSizeInPercent  rootElementFontSizePx

			const rootElementFontSizeInPercent = (100 * rootElementFontSizePx) / (16 * browserFontSizeFactor);

			rootElement.style.fontSize = `${16 * (rootElementFontSizeInPercent / 100) * zoomState.targetBrowserFontSizeFactor}px`;

		},
		[browserFontSizeFactor, zoomState.targetBrowserFontSizeFactor]
	);

	return (
		<div
			about={`powerhooks ZoomProvider outer wrapper`}
			style={{ "height": "100vh", "overflow": "hidden" }}
		>
			<div
				about={`powerhooks ZoomProvider inner wrapper`}
				style={{
					"transform": `scale(${zoomState.zoomFactor})`,
					"transformOrigin": "0 0",
					"width": zoomState.targetWindowInnerWidth,
					"height": zoomState.targetWindowInnerHeight,
					"overflow": "hidden"
				}}
			>
				{children}
			</div>
		</div>
	);

}
