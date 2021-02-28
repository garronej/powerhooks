
import * as reactDom from "react-dom";

import { App } from "components/App/App";
import { ThemeProvider } from "theme/ThemeProvider";
import { useIsDarkModeEnabled } from "tools/useIsDarkModeEnabled";

function Root() {

    const { isDarkModeEnabled } = useIsDarkModeEnabled();

    return (
        <ThemeProvider isDarkModeEnabled={isDarkModeEnabled}>
            <App />
        </ThemeProvider>
    );

}

reactDom.render(
    <Root/>,
    document.getElementById("root")
);
