// @ts-nocheck

//Without powerhooks:

import { useCallback } from "react";


const onClick = useCallback(
    () => {
        //Do do something with x and y
    },
    [x, y]
);

//Each time x and/or y have changed since the previous render
//onClick gets a new reference. Witch is a pain when using React.memo.
//On top of that if an involved state is forgotten in the dependency array
//the callback will encapsulate states that are out of date.. 

//With:

import { useConstCallback } from "powerhooks";


const onClick = useConstCallback(
    ()=>{
        //Do do something with x and y
    }
);

//The value of onClick never changes across renders
//yet the values of x ant y are always up to date.


//ignore
onClick


