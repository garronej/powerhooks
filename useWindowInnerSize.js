"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWindowInnerSize = void 0;
var evt_1 = require("evt");
var useEvt_1 = require("evt/hooks/useEvt");
var useRerenderOnStateChange_1 = require("evt/hooks/useRerenderOnStateChange");
function useWindowInnerSize() {
    var evtInnerWidth = useEvt_1.useEvt(function (ctx) {
        return evt_1.Evt.from(ctx, window, "resize")
            .toStateful()
            .pipe(function () { return [{
                "windowInnerWidth": window.innerWidth,
                "windowInnerHeight": window.innerHeight
            }]; });
    }, []);
    useRerenderOnStateChange_1.useRerenderOnStateChange(evtInnerWidth);
    return evtInnerWidth.state;
}
exports.useWindowInnerSize = useWindowInnerSize;
//# sourceMappingURL=useWindowInnerSize.js.map