"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWindowInnerSize = void 0;
var evt_1 = require("evt");
var hooks_1 = require("evt/hooks");
function useWindowInnerSize() {
    var evtInnerWidth = hooks_1.useEvt(function (ctx) {
        return evt_1.Evt.from(ctx, window, "resize")
            .toStateful()
            .pipe(function () { return [{
                "windowInnerWidth": window.innerWidth,
                "windowInnerHeight": window.innerHeight
            }]; });
    }, []);
    hooks_1.useStatefulEvt([evtInnerWidth]);
    return evtInnerWidth.state;
}
exports.useWindowInnerSize = useWindowInnerSize;
//# sourceMappingURL=useWindowInnerSize.js.map