
import * as reactDom from "react-dom";
import { App } from "components/App/App";
import { ThemeProvider } from "theme/ThemeProvider";
//import { IsDarkModeEnabledProvider2 } from "./theme/useIsDarkModeEnable2";
import "./main.scss";

reactDom.render(
    <ThemeProvider >
            <App />
    </ThemeProvider>,
    document.getElementById("root")
);
