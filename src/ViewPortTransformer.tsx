

import type { ReactNode } from "react";
import { useRef } from "react";
import { useGuaranteedMemo } from "./useGuaranteedMemo";
import { useWindowInnerSize } from "./tools/useWindowInnerSize";
import { useBrowserFontSizeFactor } from "./tools/useBrowserFontSizeFactor";
import { useEffect, createContext, useContext } from "react";

export type ViewPortConfig = {
	targetWindowInnerWidth: number;
	targetBrowserFontSizeFactor: number;
};

export function matchViewPortConfig(viewPortConfig: ViewPortConfig | ReactNode): viewPortConfig is ViewPortConfig {
	return (
		viewPortConfig instanceof Object &&
		"targetWindowInnerWidth" in viewPortConfig
	);
}

export type ViewPortTransformerProps = {
	getConfig(
		props: {
			windowInnerWidth: number;
			windowInnerHeight: number;
			browserFontSizeFactor: number;
		 }
	): ViewPortConfig | ReactNode;
	children: ReactNode;
};

export type ViewPortState = ViewPortConfig & {
	targetWindowInnerHeight: number;
	zoomFactor: number;
};

const context = createContext<ViewPortState | undefined>(undefined);

export function useViewPortState() {
	const viewPortState = useContext(context);
	return { viewPortState };
}

/**
 * WARNING: We assumes that html element font-size is not defined
 * or defined in percentages.
 */
export function ViewPortTransformer(props: ViewPortTransformerProps) {

	const { getConfig, children } = props;

	const {
		windowInnerWidth,
		windowInnerHeight,
	} = useWindowInnerSize();

	const { browserFontSizeFactor } = useBrowserFontSizeFactor();


	const { viewPortState } = (function useClosure() {

		const viewPortStateRef = useRef<ViewPortState | ReactNode>();

		useGuaranteedMemo(
			() => {

				//We skip refresh when pinch and zoom
				if (
					viewPortStateRef.current !== undefined &&
					(
						window.scrollY !== 0 ||
						window.scrollX !== 0
					)
				) {
					return;
				}

				const viewPortConfig = getConfig({
					windowInnerWidth,
					windowInnerHeight,
					browserFontSizeFactor
				});

				if (!matchViewPortConfig(viewPortConfig)) {

					viewPortStateRef.current = viewPortConfig;

					return;

				}

				const zoomFactor = windowInnerWidth / viewPortConfig.targetWindowInnerWidth;

				const viewPortState: ViewPortState = {
					...viewPortConfig,
					zoomFactor,
					"targetWindowInnerHeight": windowInnerHeight / zoomFactor
				};

				viewPortStateRef.current = viewPortState;

			},
			[
				windowInnerWidth,
				windowInnerHeight,
				browserFontSizeFactor
			]
		);

		return { "viewPortState": viewPortStateRef.current! };

	})();

	useEffect(
		() => {

			if (!matchViewPortConfig(viewPortState)) {
				return;
			}

			//NOTE: We assert the font size is defined in percent 
			//or not defined. We have no way to check it so we make
			//it a requirement to use the view port transformer.

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
				`${16 * (rootElementFontSizeInPercent / 100) * viewPortState.targetBrowserFontSizeFactor}px`;

		},
		[
			browserFontSizeFactor,
			matchViewPortConfig(viewPortState) ?
				viewPortState.targetBrowserFontSizeFactor :
				Object
		]
	);

	return (
		!matchViewPortConfig(viewPortState) ?
			<>{viewPortState}</> :
			<div
				about={`powerhooks ${ViewPortTransformer.name} outer wrapper`}
				style={{ "height": "100vh", "overflow": "hidden" }}
			>
				<div
					about={`powerhooks ${ViewPortTransformer.name} inner wrapper`}
					style={{
						"transform": `scale(${viewPortState.zoomFactor})`,
						"transformOrigin": "0 0",
						"width": viewPortState.targetWindowInnerWidth,
						"height": viewPortState.targetWindowInnerHeight,
						"overflow": "hidden"
					}}
				>
					<context.Provider value={viewPortState}>
						{children}
					</context.Provider>
				</div>
			</div>
	);

}


