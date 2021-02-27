"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEffectButSkipFirstRender = void 0;
var react_1 = require("react");
function useEffectButSkipFirstRender(effect, deps) {
    var refIsFistRender = react_1.useRef(true);
    react_1.useEffect(function () {
        if (refIsFistRender.current) {
            refIsFistRender.current = false;
            return;
        }
        return effect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
exports.useEffectButSkipFirstRender = useEffectButSkipFirstRender;
//# sourceMappingURL=useEffectButSkipFirstRender.js.map