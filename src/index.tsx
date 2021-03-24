
import * as reactDom from "react-dom";
import { ThemeProvider } from "theme/ThemeProvider";
import {App} from "./components/App/App";
import {appData} from "data";


reactDom.render(
    <ThemeProvider >
        <App
            {...appData}
        />
    </ThemeProvider>,
    document.getElementById("root")
);
