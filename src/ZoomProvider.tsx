

import { useContext, useMemo, createContext } from "react";
import type { ReactNode } from "react";
import { useWindowInnerSize as useWindowAbsoluteInnerSize } from "./tools/useWindowInnerSize";

const context = createContext<{ referenceWidth?: number; }>({});

export type ZoomProviderProps = ZoomProviderProps.Enabled | ZoomProviderProps.Disabled;
export declare namespace ZoomProviderProps {

	type WithChildren = {
		children: ReactNode;
	};

	type Enabled = {
		referenceWidth: number;
		/** 
		 * Message to display when portrait mode, example: 
		 *    This app isn't compatible with landscape mode yet,
		 *    please enable the rotation sensor and flip your phone.
		 */
		portraitModeUnsupportedMessage?: ReactNode;
	} & WithChildren;

	type Disabled = {
		referenceWidth?: undefined;
	} & WithChildren;

}

export function useZoomProviderReferenceWidth() {

	const { referenceWidth } = useContext(context);
	return { referenceWidth };

}

export function getZoomFactor(
	params: {
		referenceWidth: number | undefined;
		windowInnerWidth: number;
	}
) {

	const { referenceWidth, windowInnerWidth } = params;


	const zoomFactor = referenceWidth !== undefined ?
		windowInnerWidth / referenceWidth :
		1;

	return { zoomFactor };

}

export function ZoomProvider(props: ZoomProviderProps) {

	const { referenceWidth, children } = props;

	const { 
		windowInnerWidth, 
		windowInnerHeight, 
		isLandscapeOrientation 
	} = useWindowAbsoluteInnerSize();

	const { portraitModeUnsupportedMessage } = "portraitModeUnsupportedMessage" in props ?
		props :
		{ "portraitModeUnsupportedMessage": undefined };

	const value = useMemo(() => ({ referenceWidth }), [referenceWidth ?? Object]);

	const { zoomFactor } = getZoomFactor({ referenceWidth, windowInnerWidth })

	return (
		<context.Provider value={value}>
			{
				(
					!isLandscapeOrientation &&
					portraitModeUnsupportedMessage !== undefined &&
					referenceWidth !== undefined
				) ?
					portraitModeUnsupportedMessage :
					<div
						about={`powerhooks ZoomProvider${referenceWidth === undefined ? " (disabled)" : ""}`}
						style={{
							"height": "100vh",
							"overflow": "hidden"
						}}
					>
						{
							referenceWidth !== undefined ?
								<div
									about={`powerhooks ZoomProvider inner`}
									style={{
										"transform": `scale(${zoomFactor})`,
										"transformOrigin": "0 0",
										"width": referenceWidth,
										"height": windowInnerHeight / zoomFactor,
										"overflow": "hidden"
									}}
								>
									{children}
								</div>
								:
								children
						}
					</div>
			}
		</context.Provider>
	);

}
