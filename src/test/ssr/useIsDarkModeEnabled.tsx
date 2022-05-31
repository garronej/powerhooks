/* eslint-disable react/display-name */

import { memo } from "react";
import { createUseSsrGlobalState } from "powerhooks/useSsrGlobalState";


export const { evtIsDarkModeEnabled, useIsDarkModeEnabled, withIsDarkModeEnabled } = createUseSsrGlobalState({
	"name": "isDarkModeEnabled",
	"getInitialValueClientSide": () =>
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches,
	"getInitialValueServerSide": () => ({
		"doFallbackToGetInitialValueClientSide": true,
		"initialValue": false
	}),
});

export const DarkModeRootStyle = memo(() => {

	const { isDarkModeEnabled } = useIsDarkModeEnabled();

	return (
		<style>
			{`
				:root {
					color-scheme: ${isDarkModeEnabled ? "dark" : "light"}
				}
			`}
		</style>
	);


});

