"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomProvider = exports.useDomRect = void 0;
var React = require("react");
var react_1 = require("react");
var react_2 = require("react");
var hooks_1 = require("evt/hooks");
var evt_1 = require("evt");
var resize_observer_polyfill_1 = require("resize-observer-polyfill");
var useWindowInnerSize_1 = require("./useWindowInnerSize");
function Evt_fromObserver(ctx, ObserverConstructor, target) {
    var evt = evt_1.Evt.create();
    var listener = function () { return evt.post(); };
    var observer = new ObserverConstructor(listener);
    observer.observe(target);
    ctx.evtDoneOrAborted.attachOnce(function () { return observer.disconnect(); });
    return evt;
}
// https://gist.github.com/morajabi/523d7a642d8c0a2f71fcfa0d8b3d2846
// https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
function useDomRect() {
    var _a;
    var ref = react_2.useRef(null);
    var _b = __read(react_2.useState({
        "bottom": 0,
        "right": 0,
        "top": 0,
        "left": 0,
        "height": 0,
        "width": 0
    }), 2), domRect = _b[0], setDomRect = _b[1];
    var _c = __read(react_2.useState(null), 2), htmlElement = _c[0], setHtmlElement = _c[1];
    react_2.useEffect(function () { setHtmlElement(ref.current); }, 
    /* // eslint-disable-next-line react-hooks/exhaustive-deps */
    [(_a = ref.current) !== null && _a !== void 0 ? _a : {}]);
    var referenceWidth = react_2.useContext(zoomContext).referenceWidth;
    hooks_1.useEvt(function (ctx) {
        if (htmlElement === null) {
            return;
        }
        Evt_fromObserver(ctx, resize_observer_polyfill_1.default, htmlElement)
            .toStateful()
            .attach(function () {
            /*
            const { ...boundingClientRect } = htmlElement.getBoundingClientRect();
            if (referenceWidth !== undefined) {
                (["bottom", "right", "top", "left", "height", "width"] as const)
                    .forEach(key => boundingClientRect[key] = (boundingClientRect[key] / ( window.innerWidth / referenceWidth)));
            }
            setDomRect(boundingClientRect);
            */
            var _a = htmlElement.getBoundingClientRect(), bottom = _a.bottom, right = _a.right, top = _a.top, left = _a.left, height = _a.height, width = _a.width;
            if (referenceWidth === undefined) {
                setDomRect({ bottom: bottom, right: right, top: top, left: left, height: height, width: width });
            }
            else {
                var factor = window.innerWidth / referenceWidth;
                setDomRect({
                    "bottom": bottom / factor,
                    "right": right / factor,
                    "top": top / factor,
                    "left": left / factor,
                    "height": height / factor,
                    "width": width / factor
                });
            }
        });
    }, [htmlElement, referenceWidth]);
    return { domRect: domRect, ref: ref };
}
exports.useDomRect = useDomRect;
var zoomContext = react_1.createContext({});
function ZoomProvider(props) {
    var referenceWidth = props.referenceWidth, children = props.children;
    var _a = useWindowInnerSize_1.useWindowInnerSize(), windowInnerWidth = _a.windowInnerWidth, windowInnerHeight = _a.windowInnerHeight;
    if (referenceWidth === undefined) {
        return React.createElement(React.Fragment, null, children);
    }
    var zoomFactor = windowInnerWidth / referenceWidth;
    return react_1.createElement(zoomContext.Provider, { "value": { referenceWidth: referenceWidth } }, React.createElement("div", { style: {
            "height": "100vh",
            "overflow": "hidden"
        } },
        React.createElement("div", { style: {
                "transform": "scale(" + zoomFactor + ")",
                "transformOrigin": "0 0",
                "width": referenceWidth,
                "height": windowInnerHeight / zoomFactor,
                "overflow": "hidden"
            } }, children)));
}
exports.ZoomProvider = ZoomProvider;
//# sourceMappingURL=useDomRect.js.map