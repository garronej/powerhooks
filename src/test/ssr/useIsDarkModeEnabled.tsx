/* eslint-disable react/display-name */

import { memo } from "react";
import { createUseSsrGlobalState } from "powerhooks/useSsrGlobalState";


export const { evtIsDarkModeEnabled, useIsDarkModeEnabled, withIsDarkModeEnabled } = createUseSsrGlobalState({
	"name": "isDarkModeEnabled",
	"getInitialStateClientSide": async () =>
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches,
	"getInitialStateServerSide": async () => ({
		"doFallbackToGetInitialStateClientSide": true,
		"initialState": false
	})
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

