"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typeSafety_1 = require("evt/tools/typeSafety");
var inDepth = require("evt/tools/inDepth");
var __1 = require("..");
typeSafety_1.assert(inDepth.same(__1.myObject, { "p": "FOO" }));
console.log("PASS");
//# sourceMappingURL=myObject.js.map