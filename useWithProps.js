"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWithProps = void 0;
var useGuaranteedMemo_1 = require("./useGuaranteedMemo");
var objectKeys_1 = require("evt/tools/typeSafety/objectKeys");
var withProps_1 = require("./withProps");
/**
 * Assert: The number of properties in preInjectedProps is constant
 */
var useWithProps = function (Component, preInjectedProps) {
    return useGuaranteedMemo_1.useGuaranteedMemo(function () { return withProps_1.withProps(Component, preInjectedProps); }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    objectKeys_1.objectKeys(preInjectedProps).map(function (key) { return preInjectedProps[key]; }));
};
exports.useWithProps = useWithProps;
//# sourceMappingURL=useWithProps.js.map