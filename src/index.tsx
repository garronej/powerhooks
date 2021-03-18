
import * as reactDom from "react-dom";
import { ThemeProvider } from "theme/ThemeProvider";
import {App} from "./components/App/App";


reactDom.render(
    <ThemeProvider >
        <App/>
    </ThemeProvider>,
    document.getElementById("root")
);
