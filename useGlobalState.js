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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
var memoizee_1 = __importDefault(require("memoizee"));
var getPersistentStorage = (function () {
    function getLocalStorageImplementationOfPersistantStorage(params) {
        var key = params.key;
        return {
            "getItem": function () { return localStorage.getItem(key); },
            "setItem": function (value) { return localStorage.setItem(key, value); }
        };
    }
    function getCookieImplementationOfPersistantStorage(params) {
        var key = params.key;
        return {
            "getItem": function () {
                var _a, _b, _c;
                return (_c = (_b = (_a = document.cookie
                    .split("; ")
                    .find(function (row) { return row.startsWith(key + "="); })) === null || _a === void 0 ? void 0 : _a.split("=")) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : null;
            },
            "setItem": function (value) {
                var newCookie = key + "=" + value + ";path=/;max-age=31536000";
                //We do not set the domain if we are on localhost or an ip
                if (window.location.hostname.match(/\.[a-zA-Z]{2,}$/)) {
                    newCookie += ";domain=" + (window.location.hostname.split(".").length >= 3 ?
                        window.location.hostname.replace(/^[^.]+\./, "") :
                        window.location.hostname);
                }
                document.cookie = newCookie;
            }
        };
    }
    function getPersistentStorage(params) {
        var key = params.key, mechanism = params.mechanism;
        switch (mechanism) {
            case "localStorage": return getLocalStorageImplementationOfPersistantStorage({ key: key });
            case "cookie": return getCookieImplementationOfPersistantStorage({ key: key });
        }
    }
    return { getPersistentStorage: getPersistentStorage };
})().getPersistentStorage;
var names = new Set();
/**
 *
 * Assert: If localStorageKey is not disabled, T must be
 * serializable with JSON.stringify.
 *
 * const { useFoo } = createUseGlobalState2({
 *     "getDefaultState": ()=> 33,
 *     "name": "foo"
 * });
 *
 * const { foo, setFoo  } = useFoo();
 */
function createUseGlobalState(name, 
/** If function called only if not in local storage */
initialState, params) {
    var _a;
    var _b = (params !== null && params !== void 0 ? params : {}).persistance, persistance = _b === void 0 ? "cookie" : _b;
    var persistentStorage = persistance === false ?
        undefined :
        getPersistentStorage({
            "mechanism": persistance !== null && persistance !== void 0 ? persistance : "localStorage",
            "key": (assert_1.assert(!names.has(name)),
                names.add(name),
                "useGlobalState_" + name)
        });
    var getEvtValue = memoizee_1.default(function () {
        //TODO: should be initialized when first used
        var evtValue = evt_1.Evt.create(((persistentStorage !== undefined &&
            (function () {
                var serializedBoxedValue = persistentStorage.getItem();
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
        if (persistentStorage !== undefined) {
            evtValue.attach(function (value) {
                return persistentStorage.setItem(JSON.stringify([value]));
            });
        }
        return { evtValue: evtValue };
    });
    function useGlobalState() {
        var _a;
        var evtValue = getEvtValue().evtValue;
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