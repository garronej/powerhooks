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
exports.useValueChangeEffect = void 0;
var useEffectButSkipFirstRender_1 = require("./useEffectButSkipFirstRender");
function useValueChangeEffect(effect, values) {
    useEffectButSkipFirstRender_1.useEffectButSkipFirstRender(function () {
        effect.apply(void 0, __spreadArray([], __read(values)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, values);
}
exports.useValueChangeEffect = useValueChangeEffect;
//# sourceMappingURL=useValueChangeEffect.js.map