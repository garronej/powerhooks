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
exports.createUseGlobalState = void 0;
var react_1 = require("react");
var evt_1 = require("evt");
var hooks_1 = require("evt/hooks");
var useConstCallback_1 = require("./useConstCallback");
var assert_1 = require("evt/tools/typeSafety/assert");
var overwriteReadonlyProp_1 = require("evt/tools/typeSafety/overwriteReadonlyProp");
var typeGuard_1 = require("evt/tools/typeSafety/typeGuard");
var capitalize_1 = require("./tools/capitalize");
var names = new Set();
/**
 *
 * Assert: If localStorageKey is not disabled, T must be
 * serializable with JSON.stringify.
 *
 * const { useFoo } = createUseGlobalState2({
 *     "getDefaultState": ()=> 33,
 *     "name": "foo"
 * });
 *
 * const { foo, setFoo  } = useFoo();
 */
function createUseGlobalState(name, 
/** If function called only if not in local storage */
initialState, params) {
    var _a;
    var _b = (params !== null && params !== void 0 ? params : {}).doDisableLocalStorage, doDisableLocalStorage = _b === void 0 ? false : _b;
    var localStorageKey = doDisableLocalStorage ?
        undefined :
        (assert_1.assert(!names.has(name)),
            names.add(name),
            "useGlobalState_" + name);
    //TODO: should be initialized when first used
    var evtValue = evt_1.Evt.create(((localStorageKey !== undefined &&
        (function () {
            var serializedBoxedValue = localStorage.getItem(localStorageKey);
            return serializedBoxedValue === null ?
                false :
                JSON.parse(serializedBoxedValue);
        })())
        ||
            [
                typeGuard_1.typeGuard(initialState, typeof initialState === "function") ?
                    initialState() :
                    initialState
            ])[0]);
    if (localStorageKey !== undefined) {
        evtValue.attach(function (value) { return localStorage.setItem(localStorageKey, JSON.stringify([value])); });
    }
    function useGlobalState() {
        var _a;
        var _b = __read(react_1.useState(evtValue.state), 2), state = _b[0], setState = _b[1];
        hooks_1.useEvt(function (ctx) { return evtValue
            .toStateless(ctx)
            .attach(setState); }, []);
        return _a = {},
            _a[name] = state,
            _a["set" + capitalize_1.capitalize(name)] = useConstCallback_1.useConstCallback(function (valueOrGetValue) {
                return evtValue.state = typeof valueOrGetValue === "function" ?
                    valueOrGetValue(state) :
                    valueOrGetValue;
            }),
            _a;
    }
    var out = (_a = {},
        _a["use" + capitalize_1.capitalize(name)] = useGlobalState,
        _a);
    try {
        overwriteReadonlyProp_1.overwriteReadonlyProp(useGlobalState, "name", Object.keys(out)[0]);
    }
    catch (_c) { }
    return out;
}
exports.createUseGlobalState = createUseGlobalState;
//# sourceMappingURL=useGlobalState.js.map