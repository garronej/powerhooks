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
exports.useClick = void 0;
var react_1 = require("react");
var evt_1 = require("evt");
var hooks_1 = require("evt/hooks");
var id_1 = require("evt/tools/typeSafety/id");
var memoize = require("memoizee");
var useConstCallback_1 = require("./useConstCallback");
/**
 * Why not use onDoubleClick?
 * Because it down is fired event when a double click is pending.
 * NOTE: callback does not need to be constant.
 */
function useClick(params) {
    var doubleClickDelayMs = params.doubleClickDelayMs;
    var constCallback = useConstCallback_1.useConstCallback(params.callback);
    var _a = __read(react_1.useState(function () {
        var evtMouseUpOrDown = evt_1.Evt.create();
        return {
            evtMouseUpOrDown: evtMouseUpOrDown,
            "getOnMouseProps": memoize(function (extraArg) { return ({
                "onMouseDown": id_1.id(function (mouseEvent) {
                    evtMouseUpOrDown.post({ "type": "down", mouseEvent: mouseEvent, extraArg: extraArg });
                }),
                "onMouseUp": id_1.id(function (mouseEvent) {
                    evtMouseUpOrDown.post({ "type": "up", mouseEvent: mouseEvent, extraArg: extraArg });
                })
            }); })
        };
    }), 1), _b = _a[0], evtMouseUpOrDown = _b.evtMouseUpOrDown, getOnMouseProps = _b.getOnMouseProps;
    //NOTE: We wrap in useEvt for update when double click delay is changed
    hooks_1.useEvt(function (ctx) {
        var evtDownOrDouble = evt_1.Evt.create();
        evtMouseUpOrDown
            .pipe(ctx, function (_a) {
            var type = _a.type, mouseEvent = _a.mouseEvent, extraArg = _a.extraArg;
            return type !== "down" ?
                null : [{ "now": Date.now(), mouseEvent: mouseEvent, extraArg: extraArg }];
        })
            .pipe([
            function (_a, prev) {
                var mouseEvent = _a.mouseEvent, now = _a.now, extraArg = _a.extraArg;
                return [{
                        now: now,
                        "isPendingDouble": (now - prev.now) < doubleClickDelayMs,
                        mouseEvent: mouseEvent,
                        extraArg: extraArg
                    }];
            },
            {
                "now": 0,
                "isPendingDouble": false,
                "mouseEvent": null,
                "extraArg": null
            }
        ])
            .attachExtract(function (_a) {
            var isPendingDouble = _a.isPendingDouble;
            return isPendingDouble;
        }, function (_a) {
            var mouseEvent = _a.mouseEvent, extraArg = _a.extraArg;
            //NOTE: Prevent text selection on double click: 
            //https://stackoverflow.com/a/55617595/3731798
            mouseEvent.preventDefault();
            evtMouseUpOrDown.attachOnce(function (_a) {
                var type = _a.type;
                return type === "up";
            }, ctx, function (_a) {
                var mouseEvent = _a.mouseEvent;
                return evtDownOrDouble.post({
                    "type": "double",
                    mouseEvent: mouseEvent,
                    extraArg: extraArg
                });
            });
        })
            .attach(function (_a) {
            var mouseEvent = _a.mouseEvent, extraArg = _a.extraArg;
            return evtDownOrDouble.post({
                "type": "down",
                mouseEvent: mouseEvent,
                extraArg: extraArg
            });
        });
        evtDownOrDouble.attach(function (_a) {
            var type = _a.type, mouseEvent = _a.mouseEvent, extraArg = _a.extraArg;
            return constCallback({ type: type, mouseEvent: mouseEvent, extraArg: extraArg });
        });
    }, [doubleClickDelayMs, evtMouseUpOrDown, constCallback]);
    return { getOnMouseProps: getOnMouseProps };
}
exports.useClick = useClick;
/*
function MyComponent(){

    const { getOnMouseProps } = useClick<{ btnIndex: number; }>({
        "doubleClickDelayMs": 300,
        "callback": ({ extraArg: { btnIndex }, type }) => {

            console.log(`We got a click type ${type} on button index: ${btnIndex}`);

            return null as any;

        }
    });

    return (
        <>
        <button {...getOnMouseProps({ "btnIndex": 1})}> my button 1</button>
        <button {...getOnMouseProps({ "btnIndex": 2})}> my button 1</button>
        <button {...getOnMouseProps({ "btnIndex": 3})}> my button 1</button>
        </>
    );

}
*/ 
//# sourceMappingURL=useClick.js.map