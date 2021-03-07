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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUseScopedState = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var capitalize_1 = require("./tools/capitalize");
var useNamedState_1 = require("./useNamedState");
var overwriteReadonlyProp_1 = require("evt/tools/typeSafety/overwriteReadonlyProp");
function createUseScopedState(name, initialState) {
    var _a;
    var context = react_1.createContext(undefined);
    var useXyz = function () {
        var out = react_1.useContext(context);
        if (out === undefined) {
            throw new Error("Must be used in a component wrapped in <" + capitalize_1.capitalize(name) + "Provider />");
        }
        return out;
    };
    overwriteReadonlyProp_1.overwriteReadonlyProp(useXyz, "name", "use" + capitalize_1.capitalize(name));
    var XyzProvider = function (props) {
        var children = props.children, initialStateFromProps = props.initialState;
        var useNamedStateReturnedWrapper = useNamedState_1.useNamedState(name, (initialStateFromProps !== undefined ?
            initialStateFromProps : initialState));
        var value = react_1.useMemo(function () { return useNamedStateReturnedWrapper; }, [useNamedStateReturnedWrapper[name]]);
        return (jsx_runtime_1.jsx(context.Provider, __assign({ value: value }, { children: children }), void 0));
    };
    overwriteReadonlyProp_1.overwriteReadonlyProp(useXyz, "name", capitalize_1.capitalize(name) + "Provider");
    return _a = {},
        _a[useXyz.name] = useXyz,
        _a[XyzProvider.name] = XyzProvider,
        _a;
}
exports.createUseScopedState = createUseScopedState;
//# sourceMappingURL=useScopedState.js.map