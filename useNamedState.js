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
exports.useNamedState = void 0;
var react_1 = require("react");
var capitalize_1 = require("./tools/capitalize");
function useNamedState(name, initialState) {
    var _a;
    var _b = __read(react_1.useState(initialState), 2), state = _b[0], setState = _b[1];
    return _a = {},
        _a[name] = state,
        _a["set" + capitalize_1.capitalize(name)] = setState,
        _a;
}
exports.useNamedState = useNamedState;
//# sourceMappingURL=useNamedState.js.map