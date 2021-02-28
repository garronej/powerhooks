
import * as reactDom from "react-dom";
import { App } from "components/App/App";
import { ThemeProvider } from "theme/ThemeProvider";
import { IsDarkModeEnabledProvider2 } from "./theme/useIsDarkModeEnable2";

reactDom.render(
    <ThemeProvider >
        <IsDarkModeEnabledProvider2>
            <App />
        </IsDarkModeEnabledProvider2>
    </ThemeProvider>,
    document.getElementById("root")
);
