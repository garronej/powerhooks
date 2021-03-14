



import { useMemo } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme } from "./createTheme";
import { ThemeProvider as MuiThemeProvider, StylesProvider } from "@material-ui/core/styles";
//import { ZoomProvider } from "powerhooks";
import { useIsDarkModeEnabled } from "./useIsDarkModeEnabled";

window.addEventListener("scroll", ()=>{
    console.log("scroll");
})


export function ThemeProvider(
    props: {
        children: React.ReactNode;
    }
) {

    const { children } = props;

    const { isDarkModeEnabled } = useIsDarkModeEnabled();

    const { theme } = useMemo(
        () => createTheme({ isDarkModeEnabled }),
        [isDarkModeEnabled]
    );

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <StylesProvider injectFirst>
                    {children}
            </StylesProvider>
        </MuiThemeProvider>
    );


}








