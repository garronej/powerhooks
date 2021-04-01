
// @ts-ignore: unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Theme } from "@material-ui/core/styles/createMuiTheme";

import { createMuiTheme } from "@material-ui/core/styles";
import "./font.scss";


declare module "@material-ui/core/styles/createMuiTheme" {

    interface Theme {
        custom: {
            referenceWidth?: number;
            typeScriptBlue: string;
            backgroundLight: string;
            backgroundDark: string;
            silverGray: string;
            visualStudioCodeColor: string
        }
    }

    // allow configuration using `createMuiTheme`
    interface ThemeOptions {
        custom: Theme["custom"];
    }
}


export function createTheme(
    params: {
        isDarkModeEnabled: boolean;
    }
): { theme: Theme; } {

    const { isDarkModeEnabled } = params;

    const theme = createMuiTheme({
        "typography": {
            "fontFamily": '"Work Sans"'
        },
        "palette": {
            "type": isDarkModeEnabled ? "dark" : "light"
        },
        "custom": {
            "referenceWidth": 1920,
            "typeScriptBlue": "#0076C6",
            "backgroundDark": "#070224",
            "backgroundLight": "#a6d8f5",
            "silverGray": "#a2a7ab",
            "visualStudioCodeColor": "#1e1e1e"
        }
    });


    return { theme };

}
