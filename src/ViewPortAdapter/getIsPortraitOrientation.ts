
export function getIsPortraitOrientation(props: {
    windowInnerWidth: number;
    windowInnerHeight: number;
}) {
    const { windowInnerWidth, windowInnerHeight } = props;

	const isPortraitOrientation = 
		windowInnerWidth * 1.3 < windowInnerHeight;

    return isPortraitOrientation;
}