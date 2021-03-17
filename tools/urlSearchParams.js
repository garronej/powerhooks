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
exports.urlSearchParams = void 0;
function add(params) {
    var url = params.url, name = params.name, value = params.value;
    var newUrl = "" + url + (/\?/.test(url) ? "&" : "?") + name + "=" + encodeURI(value);
    return { newUrl: newUrl };
}
function pop(params) {
    var locationSearch = params.locationSearch, name = params.name;
    var value = undefined;
    var newLocationSearch = (function () {
        var newLocationSearch = locationSearch
            .replace(/^\?/, "")
            .split("&")
            .map(function (part) { return part.split("="); })
            .filter(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value_i = _b[1];
            return key !== name ? true : (value = decodeURI(value_i), false);
        })
            .map(function (entry) { return entry.join("="); })
            .join("&");
        newLocationSearch = newLocationSearch === "" ?
            "" : "?" + newLocationSearch;
        return { newLocationSearch: newLocationSearch };
    })().newLocationSearch;
    if (value === undefined) {
        return { "wasPresent": false };
    }
    return {
        "wasPresent": true,
        newLocationSearch: newLocationSearch,
        value: value
    };
}
exports.urlSearchParams = { add: add, pop: pop };
//# sourceMappingURL=urlSearchParams.js.map