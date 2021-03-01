"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.IsDarkModeEnabledProvider2 = exports.useIsDarkModeEnabled2 = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
//TODO:
var react_1 = require("react");
var context = react_1.createContext(undefined);
function useIsDarkModeEnabled2() {
    var out = react_1.useContext(context);
    if (out === undefined) {
        throw new Error("Must be used in a component wrapped in <IsDarkModeEnabledProvider2 />");
    }
    return out;
}
exports.useIsDarkModeEnabled2 = useIsDarkModeEnabled2;
function IsDarkModeEnabledProvider2(props) {
    var children = props.children;
    var _a = __read(react_1.useState(function () {
        return window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;
    }), 2), isDarkModeEnabled = _a[0], setIsDarkModeEnabled = _a[1];
    var value = react_1.useMemo(function () { return ({ isDarkModeEnabled: isDarkModeEnabled, setIsDarkModeEnabled: setIsDarkModeEnabled }); }, [isDarkModeEnabled]);
    return (jsx_runtime_1.jsx(context.Provider, __assign({ value: value }, { children: children }), void 0));
}
exports.IsDarkModeEnabledProvider2 = IsDarkModeEnabledProvider2;
//# sourceMappingURL=useScopedState.js.map