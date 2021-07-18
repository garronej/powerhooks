

import type { ReactNode } from "react";
import { useRef } from "react";
import { useGuaranteedMemo } from "./useGuaranteedMemo";
import { useWindowInnerSize } from "./tools/useWindowInnerSize";
import { useBrowserFontSizeFactor } from "./tools/useBrowserFontSizeFactor";
import { useEffect, createContext, useContext } from "react";


export class ViewPortOutOfRangeError extends Error {
	constructor(
		public readonly fallbackNode: ReactNode
	) {

		super();

		Object.setPrototypeOf(this, new.target.prototype);

	}
}

export type ViewPortAdapterProps = {
	/** 
	 * May throw import { ViewPortOutOfRangeError } from "powerhooks/ViewPortAdapter";
	 * to specify a fallback screen on edge cases.
	 */
	getConfig(
		props: {
			windowInnerWidth: number;
			windowInnerHeight: number;
			browserFontSizeFactor: number;
		}
	): {
		targetWindowInnerWidth: number;
		targetBrowserFontSizeFactor: number;
	};
	children: ReactNode;
};

export type ViewPortState = ReturnType<ViewPortAdapterProps["getConfig"]> & {
	targetWindowInnerHeight: number;
	zoomFactor: number;
};

const context = createContext<ViewPortState | undefined>(undefined);

export function useViewPortState() {
	const viewPortState = useContext(context);
	return { viewPortState };
}

export function getIsPortraitOrientation(props: {
    windowInnerWidth: number;
    windowInnerHeight: number;

}) {
    const { windowInnerWidth, windowInnerHeight } = props;

	const isPortraitOrientation = 
		windowInnerWidth * 1.3 < windowInnerHeight;

    return isPortraitOrientation;
}

export const chromeFontSizesFactors = {
    "Very small": 0.5625,
    "Small": 0.75,
    "Medium (Recommended)": 1,
    "Large": 1.25,
    "Very Large": 1.5,
} as const;

export type ChromeFontSize = keyof typeof chromeFontSizesFactors;

/**
 * WARNING: We assumes that html element font-size is not defined
 * or defined in percentages.
 */
export function ViewPortAdapter(props: ViewPortAdapterProps) {

	const { getConfig, children } = props;

	const {
		windowInnerWidth,
		windowInnerHeight,
	} = useWindowInnerSize();

	const { browserFontSizeFactor } = useBrowserFontSizeFactor();

	const { getConfigResult } = (function useClosure() {

		const getConfigResultRef = useRef<
			{ isOutOfRange: false, viewPortState: ViewPortState; } |
			{ isOutOfRange: true, fallbackNode: ReactNode; }
		>();

		useGuaranteedMemo(
			() => {

				//We skip refresh when pinch and zoom
				if (
					getConfigResultRef.current !== undefined &&
					(
						window.scrollY !== 0 ||
						window.scrollX !== 0
					)
				) {
					return;
				}

				let viewPortConfig: ReturnType<typeof getConfig>;

				try {


					viewPortConfig = getConfig({
						windowInnerWidth,
						windowInnerHeight,
						browserFontSizeFactor
					});

				} catch (error) {

					if (!(error instanceof ViewPortOutOfRangeError)) {
						throw error;
					}

					const { fallbackNode } = error;

					getConfigResultRef.current = {
						"isOutOfRange": true,
						fallbackNode
					};

					return;

				}


				const zoomFactor = windowInnerWidth / viewPortConfig.targetWindowInnerWidth;

				const viewPortState: ViewPortState = {
					...viewPortConfig,
					zoomFactor,
					"targetWindowInnerHeight": windowInnerHeight / zoomFactor
				};

				getConfigResultRef.current = { "isOutOfRange": false, viewPortState };

			},
			[
				getConfig,
				windowInnerWidth,
				windowInnerHeight,
				browserFontSizeFactor
			]
		);

		return { "getConfigResult": getConfigResultRef.current! };

	})();

	useEffect(
		() => {

			if (getConfigResult.isOutOfRange) {
				return;
			}

			const { viewPortState } = getConfigResult;

			//NOTE: We assert the font size is defined in percent 
			//or not defined. We have no way to check it so we make
			//it a requirement to use the view port adapter.

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
			getConfigResult.isOutOfRange ?
				Object : getConfigResult.viewPortState.targetBrowserFontSizeFactor
		]
	);

	if (getConfigResult.isOutOfRange) {
		const { fallbackNode } = getConfigResult;
		return <>{fallbackNode}</>;
	}

	const { viewPortState } = getConfigResult;

	return (
		<div
			about={`powerhooks ${ViewPortAdapter.name} outer wrapper`}
			style={{ "height": "100vh", "overflow": "hidden" }}
		>
			<div
				about={`powerhooks ${ViewPortAdapter.name} inner wrapper`}
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


