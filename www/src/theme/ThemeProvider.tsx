



import { useMemo } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
//import { ZoomProvider } from "powerhooks";
import { createTheme } from "./createTheme";
import { ThemeProvider as MuiThemeProvider, StylesProvider } from "@material-ui/core/styles";
import { ZoomProvider } from "powerhooks";

export function ThemeProvider(
    props: {
        isDarkModeEnabled: boolean;
        children: React.ReactNode;
    }
) {

    const {
        isDarkModeEnabled,
        children
    } = props;

    const { theme } = useMemo(
        () => createTheme({ isDarkModeEnabled }),
        [isDarkModeEnabled]
    );

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <StylesProvider injectFirst>
                <ZoomProvider referenceWidth={theme.custom.referenceWidth}>
                    {children}
                </ZoomProvider>
            </StylesProvider>
        </MuiThemeProvider>
    );


}




