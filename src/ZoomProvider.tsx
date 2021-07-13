

import type { ReactNode } from "react";
import { useRef } from "react";
import { useGuaranteedMemo } from "./useGuaranteedMemo";
import { useWindowInnerSize } from "./tools/useWindowInnerSize";
import { useBrowserFontSizeFactor } from "./tools/useBrowserFontSizeFactor";
import { useEffect, createContext, useContext } from "react";

export type ZoomConfig = {
	targetWindowInnerWidth: number;
	targetBrowserFontSizeFactor: number;
};

function matchZoomConfig(zoomConfig: ZoomConfig | ReactNode): zoomConfig is ZoomConfig {
	return (
		zoomConfig instanceof Object &&
		"targetWindowInnerWidth" in zoomConfig
	);
}

export type ZoomProviderProps = {
	getConfig(
		props: {
			windowInnerWidth: number;
			windowInnerHeight: number;
			browserFontSizeFactor: number;
		}
	): ZoomConfig | ReactNode;
	children: ReactNode;
};

export type ZoomState = ZoomConfig & {
	targetWindowInnerHeight: number;
	zoomFactor: number;
};

const context = createContext<ZoomState | undefined>(undefined);

export function useZoomState() {
	const zoomState = useContext(context);
	return { zoomState };
}

/**
 * WARNING: We assumes that html element font-size is not defined
 * or defined in percentages.
 */
export function ZoomProvider(props: ZoomProviderProps) {

	const { getConfig, children } = props;

	const {
		windowInnerWidth,
		windowInnerHeight,
	} = useWindowInnerSize();

	const { browserFontSizeFactor } = useBrowserFontSizeFactor();


	const { zoomState } = (function useClosure() {

		const zoomStateRef = useRef<ZoomState | ReactNode>();

		useGuaranteedMemo(
			() => {

				//We skip refresh when pinch and zoom
				if (
					zoomStateRef.current !== undefined &&
					(
						window.scrollY !== 0 ||
						window.scrollX !== 0
					)
				) {
					return;
				}

				const zoomConfig = getConfig({
					windowInnerWidth,
					windowInnerHeight,
					browserFontSizeFactor
				});

				if (!matchZoomConfig(zoomConfig)) {

					zoomStateRef.current = zoomConfig;

					return;

				}

				const zoomFactor = windowInnerWidth / zoomConfig.targetWindowInnerWidth;

				const zoomState: ZoomState = {
					...zoomConfig,
					zoomFactor,
					"targetWindowInnerHeight": windowInnerHeight / zoomFactor
				};

				zoomStateRef.current = zoomState;

			},
			[
				windowInnerWidth,
				windowInnerHeight,
				browserFontSizeFactor
			]
		);

		return { "zoomState": zoomStateRef.current! };

	})();

	useEffect(
		() => {

			if (!matchZoomConfig(zoomState)) {
				return;
			}

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

			const rootElementFontSizeInPercent =
				(100 * rootElementFontSizePx) / (16 * browserFontSizeFactor);

			rootElement.style.fontSize =
				`${16 * (rootElementFontSizeInPercent / 100) * zoomState.targetBrowserFontSizeFactor}px`;

		},
		[
			browserFontSizeFactor,
			matchZoomConfig(zoomState) ?
				zoomState.targetBrowserFontSizeFactor :
				Object
		]
	);

	return (
		!matchZoomConfig(zoomState) ?
			<>{zoomState}</> :
			<div
				about="powerhooks ZoomProvider outer wrapper"
				style={{ "height": "100vh", "overflow": "hidden" }}
			>
				<div
					about="powerhooks ZoomProvider inner wrapper"
					style={{
						"transform": `scale(${zoomState.zoomFactor})`,
						"transformOrigin": "0 0",
						"width": zoomState.targetWindowInnerWidth,
						"height": zoomState.targetWindowInnerHeight,
						"overflow": "hidden"
					}}
				>
					<context.Provider value={zoomState}>
						{children}
					</context.Provider>
				</div>
			</div>
	);

}


