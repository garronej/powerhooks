

import { flip } from "evt/tools/typeSafety/flip";
import type { ReturnType } from "evt/tools/typeSafety/ReturnType";
import type { Params } from "evt/tools/typeSafety/Params";
import type { Parameters } from "evt/tools/typeSafety/Parameters";

const o = {
    "x": {
        "y": true
    }
};

o.x.y = !o.x.y

flip(o.x, "y")


const arrOrArr: ("X" | "O")[][] = [];

function f(x: number, y: number, value: "X" | "O"): void {

    if( arrOrArr[x] === undefined ){

        arrOrArr[x] = [];

    }

    arrOrArr[x][y]= value;


}



function f3(params: { foo: number; }){
}

type T = Params<typeof f3>



function f2(x: number, y: number, value: "X" | "O") {
    (arrOrArr[x] ??= [])[y]= value;
}




export {};

