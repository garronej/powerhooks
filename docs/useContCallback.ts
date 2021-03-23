// @ts-nocheck

                            //Without powerhooks:
                            
                            import { useCallback } from "react";
                            
                            const onClick = useCallback(
                                () => {
                                    //Do do something with x and y
                                },
                                [x, y]
                            );
                            
                            //With:
                            
                            import { useConstCallback } from "powerhooks";
                            
                            const onClick = useConstCallback(
                                ()=>{
                                    //Do do something with x and y
                                }
                            );


//ignore
onClick


