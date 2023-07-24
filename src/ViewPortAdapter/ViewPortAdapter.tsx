

import  { type ReactNode, useState } from "react";
import { useGuaranteedMemo } from "../useGuaranteedMemo";
import { useBrowserFontSizeFactor } from "./useBrowserFontSizeFactor";
import { useEffect } from "react";
import { useConst } from "../useConst";
import { assert } from "tsafe/assert";
import { useEvt } from "evt/hooks/useEvt";
import { Evt } from "evt";

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

function createGetDimension() {

	const createGetDimensionX = (dimension: "Width" | "Height"): (() => number) => {

		const pd = Object.getOwnPropertyDescriptor(window, `inner${dimension}`);

		assert(pd !== undefined);

		const { get } = pd;

		assert(get !== undefined);

		return get.bind(window);

	};

	return {
		"getWindowInnerWidth": createGetDimensionX("Width"),
		"getWindowInnerHeight": createGetDimensionX("Height")
	};

}


/**
 * WARNING: We assumes that html element font-size is not defined
 * or defined in percentages.
 */
export function ViewPortAdapter(props: ViewPortAdapterProps) {

	const { getConfig, children } = props;

	const { windowInnerWidth, windowInnerHeight } = (function useClosure() {

		const { getWindowInnerWidth, getWindowInnerHeight } = useConst(createGetDimension);

		const [dimensions, setDimensions] = useState(() => ({
			"windowInnerWidth": getWindowInnerWidth(),
			"windowInnerHeight": getWindowInnerHeight()
		}));

		useEvt(ctx =>
			Evt.from(ctx, window, "resize")
				.attach(() => setDimensions({
					"windowInnerWidth": getWindowInnerWidth(),
					"windowInnerHeight": getWindowInnerHeight()
				})),
			[]
		);

		return dimensions;

	})();

	//const { browserFontSizeFactor } = useBrowserFontSizeFactor();

	const { resultOfGetConfig } = (function useClosure() {

		const refResultOfGetConfig = useConst<{
			current:
			{
				isOutOfRange: false;
				zoomFactor: number;
				targetWindowInnerWidth: number;
				targetWindowInnerHeight: number;
				targetBrowserFontSizeFactor: number;
			} |
			{ isOutOfRange: true, fallbackNode: ReactNode; } |
			undefined;
		}>(() => ({ "current": undefined }));

		useGuaranteedMemo(
			() => {

				//We skip refresh when pinch and zoom
				if (
					refResultOfGetConfig.current !== undefined &&
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

					refResultOfGetConfig.current = {
						"isOutOfRange": true,
						fallbackNode
					};

					return;

				}

				//TODO: do something with viewPortConfig.targetBrowserFontSizeFactor
				//TODO: Pollute window.innerWidth and window.innerHeight
				//TODO: Pollute HTMLDivElement.prototype.getBoundingClientRect

				const zoomFactor = windowInnerWidth / viewPortConfig.targetWindowInnerWidth;

				refResultOfGetConfig.current = {
					"isOutOfRange": false,
					zoomFactor,
					"targetWindowInnerHeight": windowInnerHeight / zoomFactor,
					"targetWindowInnerWidth": viewPortConfig.targetWindowInnerWidth,
					"targetBrowserFontSizeFactor": viewPortConfig.targetBrowserFontSizeFactor
				};

			},
			[
				getConfig,
				windowInnerWidth,
				windowInnerHeight,
				browserFontSizeFactor
			]
		);

		assert(refResultOfGetConfig.current !== undefined);

		return { "resultOfGetConfig": refResultOfGetConfig.current };

	})();

	useEffect(
		() => {

			if (resultOfGetConfig.isOutOfRange) {
				return;
			}

			const { targetBrowserFontSizeFactor } = resultOfGetConfig;

			//NOTE: We assert the font size is defined in percent 
			//or not defined. We have no way to check it so we make
			//it a requirement to use the view port adapter.

			const rootElement = document.querySelector("html")!;

			const rootElementFontSizePx =
				// TODO: This must return 16 * targetBrowserFontSizeFactor
				parseInt(
					window.getComputedStyle(rootElement, null)
						.getPropertyValue("font-size")
						.replace(/px$/, "")
				);

			//CSSStyleDeclaration.prototype.getPropertyValue

			//Cross multiplication
			//100     						16 * browserFontSizeFactor;
			//rootElementFontSizeInPercent  rootElementFontSizePx

			const rootElementFontSizeInPercent =
				(100 * rootElementFontSizePx) / (16 * browserFontSizeFactor);

			rootElement.style.fontSize =
				`${16 * (rootElementFontSizeInPercent / 100) * targetBrowserFontSizeFactor}px`;

		},
		[
			browserFontSizeFactor,
			resultOfGetConfig.isOutOfRange ?  Object : resultOfGetConfig.viewPortState.targetBrowserFontSizeFactor
		]
	);

	if (resultOfGetConfig.isOutOfRange) {
		const { fallbackNode } = resultOfGetConfig;
		return <>{fallbackNode}</>;
	}

	const { zoomFactor, targetWindowInnerWidth, targetWindowInnerHeight } = resultOfGetConfig;

	return (
		<div
			about={`powerhooks ${ViewPortAdapter.name} outer wrapper`}
			style={{ "height": "100vh", "overflow": "hidden" }}
		>
			<div
				about={`powerhooks ${ViewPortAdapter.name} inner wrapper`}
				style={{
					"transform": `scale(${zoomFactor})`,
					"transformOrigin": "0 0",
					"width": targetWindowInnerWidth,
					"height": targetWindowInnerHeight,
					"overflow": "hidden"
				}}
			>
				{children}
			</div>
		</div>
	);

}

