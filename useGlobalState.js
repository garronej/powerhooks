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
exports.createUseGlobalState = exports.injectGlobalStatesInSearchParams = exports.globalStates = void 0;
var react_1 = require("react");
var evt_1 = require("evt");
var hooks_1 = require("evt/hooks");
var useConstCallback_1 = require("./useConstCallback");
var assert_1 = require("evt/tools/typeSafety/assert");
var overwriteReadonlyProp_1 = require("evt/tools/typeSafety/overwriteReadonlyProp");
var typeGuard_1 = require("evt/tools/typeSafety/typeGuard");
var capitalize_1 = require("./tools/capitalize");
var memoizee_1 = __importDefault(require("memoizee"));
var urlSearchParams_1 = require("./tools/urlSearchParams");
exports.globalStates = {};
function stringify(obj) {
    return JSON.stringify([obj]);
}
function parse(str) {
    return JSON.parse(str)[0];
}
var _a = (function () {
    var paramPrefix = "powerhooks_useGlobalState_";
    /** Returns the modified url */
    function injectGlobalStatesInSearchParams(url) {
        var newUrl = url;
        Object.keys(exports.globalStates)
            .forEach(function (name) {
            return newUrl = urlSearchParams_1.urlSearchParams
                .add({
                "url": newUrl,
                "name": paramPrefix + name,
                "value": stringify(exports.globalStates[name])
            })
                .newUrl;
        });
        return newUrl;
    }
    function getStatesFromUrlSearchParams(params) {
        var name = params.name;
        var popResult = urlSearchParams_1.urlSearchParams.pop({
            "locationSearch": window.location.search,
            "name": paramPrefix + name
        });
        if (!popResult.wasPresent) {
            return { "wasPresent": false };
        }
        window.history.replaceState("", "", "" + location.href.split("?")[0] + popResult.newLocationSearch);
        return {
            "wasPresent": true,
            "state": parse(popResult.value)
        };
    }
    return {
        injectGlobalStatesInSearchParams: injectGlobalStatesInSearchParams,
        getStatesFromUrlSearchParams: getStatesFromUrlSearchParams
    };
})(), injectGlobalStatesInSearchParams = _a.injectGlobalStatesInSearchParams, getStatesFromUrlSearchParams = _a.getStatesFromUrlSearchParams;
exports.injectGlobalStatesInSearchParams = injectGlobalStatesInSearchParams;
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
            "key": (assert_1.assert(Object.keys(exports.globalStates).indexOf(name) < 0, name + " already in use"),
                "useGlobalState_" + name)
        });
    var getEvtXyz = memoizee_1.default(function () {
        var storeStateInPersistentStorage = persistentStorage == undefined ?
            undefined :
            function (state) { return persistentStorage.setItem(stringify(state)); };
        var evtXyz = evt_1.Evt.create((function () {
            if (persistentStorage !== undefined) {
                var serializedState = persistentStorage.getItem();
                if (serializedState !== null) {
                    return parse(serializedState);
                }
            }
            var urlSearchParam = getStatesFromUrlSearchParams({ name: name });
            if (urlSearchParam.wasPresent) {
                var state = urlSearchParam.state;
                storeStateInPersistentStorage === null || storeStateInPersistentStorage === void 0 ? void 0 : storeStateInPersistentStorage(state);
                return state;
            }
            return typeGuard_1.typeGuard(initialState, typeof initialState === "function") ?
                initialState() :
                initialState;
        })());
        if (storeStateInPersistentStorage !== undefined) {
            evtXyz.attach(storeStateInPersistentStorage);
        }
        return evtXyz;
    });
    Object.defineProperty(exports.globalStates, name, {
        "enumerable": true,
        "get": function () { return getEvtXyz().state; }
    });
    function useXyz() {
        var _a;
        var evtXyz = getEvtXyz();
        var _b = __read(react_1.useState(evtXyz.state), 2), xyz = _b[0], setXyz = _b[1];
        hooks_1.useEvt(function (ctx) { return evtXyz
            .toStateless(ctx)
            .attach(setXyz); }, []);
        return _a = {},
            _a[name] = xyz,
            _a["set" + capitalize_1.capitalize(name)] = useConstCallback_1.useConstCallback(function (setStateAction) {
                return evtXyz.state =
                    typeGuard_1.typeGuard(setStateAction, typeof initialState === "function") ?
                        setStateAction(xyz) :
                        setStateAction;
            }),
            _a;
    }
    overwriteReadonlyProp_1.overwriteReadonlyProp(useXyz, "name", "use" + capitalize_1.capitalize(name));
    return Object.defineProperty((_a = {}, _a[useXyz.name] = useXyz, _a), "evt" + capitalize_1.capitalize(name), {
        "enumerable": true,
        "get": function () { return getEvtXyz(); }
    });
}
exports.createUseGlobalState = createUseGlobalState;
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
//# sourceMappingURL=useGlobalState.js.map