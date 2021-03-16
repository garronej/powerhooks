
import * as reactDom from "react-dom";
import { ThemeProvider } from "theme/ThemeProvider";
import {App} from "./components/App/App";

console.log("Welcome");

reactDom.render(
    <ThemeProvider >
        <App/>
    </ThemeProvider>,
    document.getElementById("root")
);
