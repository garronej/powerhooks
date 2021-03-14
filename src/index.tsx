
import * as reactDom from "react-dom";
import { App } from "components/App/App";
import { ThemeProvider } from "theme/ThemeProvider";
import "./main.scss";

console.log("Welcome");

reactDom.render(
    <ThemeProvider >
            <App />
    </ThemeProvider>,
    document.getElementById("root")
);
