// @ts-nocheck

//Without powerhooks:

import { useState } from "react";

//you have to manually set the consistent names "xyz" and "useXyz"
const [ count, setCount ] = useState(0);

//With:

import { useNamedState } from "powerhooks";

//Whereas with useNameState you give the name of the state as a parameter
//and deconstruct the value and setter using intellisense.
const { count, setCount } = useNamedState("count", 0);




//Ignore
console.log(count, setCount);