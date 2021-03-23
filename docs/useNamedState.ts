// @ts-nocheck










                            //Without powerhooks:

                            import { useState } from "react";

                            const [ count, setCount ] = useState(0);

                            //With:

                            import { useNamedState } from "powerhooks";

                            const {} = useNamedState("count", 0);










//Ignore
console.log(count, setCount);