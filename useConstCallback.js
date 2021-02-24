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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConstCallback = void 0;
var react_1 = require("react");
/** https://stackoverflow.com/questions/65890278/why-cant-usecallback-always-return-the-same-ref */
function useConstCallback(callback) {
    var callbackRef = react_1.useRef(callback);
    callbackRef.current = callback;
    return react_1.useState(function () { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return callbackRef.current.apply(callbackRef, __spread(args));
    }; })[0];
}
exports.useConstCallback = useConstCallback;
//# sourceMappingURL=useConstCallback.js.map