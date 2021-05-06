
import * as reactDom from "react-dom";
import {appData} from "data";
import {HomepageTemplate} from "homepage-template";


reactDom.render(
    <HomepageTemplate {...appData}/>,
    document.getElementById("root")
);
