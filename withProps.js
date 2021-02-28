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
exports.withProps = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
function withProps(Component, preInjectedProps) {
    var UntypedComponent = Component;
    return function (props) {
        return jsx_runtime_1.jsx(UntypedComponent, __assign({}, preInjectedProps, props), void 0);
    };
}
exports.withProps = withProps;
//# sourceMappingURL=withProps.js.map