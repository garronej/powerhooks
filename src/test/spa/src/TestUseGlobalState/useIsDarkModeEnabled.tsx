/* eslint-disable no-labels */
import { createUseGlobalState } from "powerhooks/useGlobalState";
import { getSearchParam } from "powerhooks/tools/urlSearchParams";
import { updateSearchBarUrl } from "powerhooks/tools/updateSearchBar";

export const { useIsDarkModeEnabled, $isDarkModeEnabled } = createUseGlobalState({
    name: "isDarkModeEnabled",
    // We use by defautl the OS preference of the user related to dark mode.
    initialState: window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches,
    // Use local storage to remember the state.
    doPersistAcrossReloads: true
});

// NOTE: If ever there is ?theme=light or ?theme=dark in the url query, we use that.
(() => {
    const result = getSearchParam({
        url: window.location.href,
        name: "theme"
    });

    if (!result.wasPresent) {
        return;
    }

    updateSearchBarUrl(result.url_withoutTheParam);

    const isDarkModeEnabled = (() => {
        switch (result.value) {
            case "dark":
                return true;
            case "light":
                return false;
            default:
                return undefined;
        }
    })();

    if (isDarkModeEnabled === undefined) {
        return;
    }

    $isDarkModeEnabled.current = isDarkModeEnabled;
})();

// NOTE: For sync: https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
// https://twitter.com/diegohaz/status/1529543787311144961?s=20&t=c6hJDBr5GUWOlXEI2xYHSg
{
    const next = (isDarkModeEnabled: boolean) => {
        const id = "root-color-scheme";

        remove_existing_element: {
            const element = document.getElementById(id);

            if (element === null) {
                break remove_existing_element;
            }

            element.remove();
        }

        const element = document.createElement("style");

        element.id = id;

        element.innerHTML = `
				:root {
					color-scheme: ${isDarkModeEnabled ? "dark" : "light"}
				}
		`;

        document.getElementsByTagName("head")[0].appendChild(element);
    };

    next($isDarkModeEnabled.current);

    $isDarkModeEnabled.subscribe(next);
}
