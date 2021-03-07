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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useArrayDiff = void 0;
var react_1 = require("react");
var evt_1 = require("evt");
var hooks_1 = require("evt/hooks");
var diff_1 = require("evt/tools/reducers/diff");
function useArrayDiff(params) {
    var watchFor = params.watchFor, array = params.array, callback = params.callback;
    var _a = __read(react_1.useState(function () { return evt_1.Evt.create(array); }), 1), evtArray = _a[0];
    react_1.useEffect(function () { evtArray.state = __spreadArray([], __read(array)); }, [array]);
    hooks_1.useEvt(function (ctx) { return evtArray
        .evtDiff
        .pipe(ctx, function (_a) {
        var prevState = _a.prevState, newState = _a.newState;
        return [diff_1.arrDiff(prevState, newState)];
    })
        .attach(function (_a) {
        var added = _a.added, removed = _a.removed;
        switch (watchFor) {
            case "addition":
                if (added.length === 0) {
                    return;
                }
                break;
            case "deletion":
                if (removed.length === 0) {
                    return;
                }
                break;
            case "addition or deletion":
                if (removed.length === 0 &&
                    added.length === 0) {
                    return;
                }
                break;
        }
        callback({
            "added": __spreadArray([], __read(added)),
            "removed": __spreadArray([], __read(removed))
        });
    }); }, [callback, evtArray, watchFor]);
}
exports.useArrayDiff = useArrayDiff;
//# sourceMappingURL=useArrayDiff.js.map