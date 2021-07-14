import React from "react";
import ReactDOM from "react-dom";
import { ViewPortTransformer } from "powerhooks/ViewPortTransformer";
import { ViewPortTransformerProps } from "powerhooks/ViewPortTransformer";
import { useConstCallback } from "powerhooks/useConstCallback";
import "./main.css";

function App() {

  const getConfig = useConstCallback<ViewPortTransformerProps["getConfig"]>(
    ({ browserFontSizeFactor, windowInnerWidth, windowInnerHeight }) => {

      const isMobileInPortraitOrientation = (windowInnerWidth / windowInnerHeight) < 1 / 1.3;

      console.log({ isMobileInPortraitOrientation });

      console.log({
        browserFontSizeFactor,
        windowInnerWidth,
        windowInnerHeight,
        "window.outerWidth": window.outerWidth,
        "window.pageXOffset": window.pageXOffset,
        "window.pageYOffset": window.pageYOffset,
        "window.screenLeft": window.screenLeft,
        "window.scrollX": window.scrollX,
        "window.scrollY": window.scrollY,
      });

      if (isMobileInPortraitOrientation) {
        return <h1>Rotate your screen</h1>;
      }

      return {
        "targetWindowInnerWidth": 1920,
        "targetBrowserFontSizeFactor": browserFontSizeFactor,
      };
    }

  );

  return (
    <ViewPortTransformer
      getConfig={getConfig}
    >
      <div style={{ "backgroundColor": "cyan", "height": "100%", "border": "1px solid red", "boxSizing": "border-box" }} >
        <h1>Hello World</h1>
        <div style={{ "backgroundColor": "blue", "width": 200, "height": 200 }} />
        <div style={{ "height": 60, "width": "50%", "border": "1px solid black", "margin": 15, "overflow": "scroll" }}>
          This is for scrolling <br />
          This is for scrolling <br />
          This is for scrolling <br />
          This is for scrolling <br />
          This is for scrolling <br />
          This is for scrolling <br />
          This is for scrolling <br />
          This is for scrolling <br />
          This is for scrolling <br />
          This is for scrolling <br />
          This is for scrolling <br />
        </div>
      </div>
    </ViewPortTransformer>
  );


}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

