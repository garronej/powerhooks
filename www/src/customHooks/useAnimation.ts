import React, {useEffect} from "react";


export function useAnimation(params: {
    ref: React.RefObject<HTMLElement>;
    parentRef?: React.RefObject<HTMLElement>;
    offset?: number;
    direction? : "vertical" | "horizontal";
    animationDuration? : number;
    fadeDuration?: number;
    animationDelay?: number;
    distanceFromViewPortToTrigger?: number;
    extraTransitions?: string[];

}){

    const {
        parentRef, 
        ref, 
        offset, 
        direction, 
        animationDuration, 
        fadeDuration,
        animationDelay,
        distanceFromViewPortToTrigger,
        extraTransitions
    } = params;

    const translate: string | undefined = (()=>{
        if(!offset){
            return undefined;
        }
        return direction === "horizontal" ? `translateX(${offset}px)` :
                    `translateY(${offset}px)`;
    })();


    const distanceToTrigger = distanceFromViewPortToTrigger ?
    distanceFromViewPortToTrigger : 0;

       

    useEffect(()=>{

        const asyncEffect = async ()=>{

            if(!ref || !ref.current){
                return;
            }

            const bounding = !parentRef || !parentRef.current ?
            ref.current.getBoundingClientRect() : 
            parentRef.current.getBoundingClientRect();

            if(bounding.y > window.innerHeight + distanceToTrigger){
                ref.current.style.opacity = "0";
            };

            if(translate){
                ref.current.style.transform = translate;
            };


            await new Promise<void>(resolve => setTimeout(resolve, 1));
        
            ref.current.style.transition = 

            `transform ${animationDuration ? animationDuration : 800}ms, 

            opacity ${fadeDuration ? fadeDuration : 300}ms

            ${extraTransitions ? `, ${extraTransitions.map(transition => `${transition}`)}` : ""}

            `;
        }

        asyncEffect();
        

        




        
    },[
        animationDuration, 
        distanceToTrigger, 
        fadeDuration, 
        parentRef, 
        ref, 
        translate,
        extraTransitions
    ]);


    useEffect(() => {
        

        const triggerAnimation = async ()=>{

            if(animationDelay){
                await new Promise<void>(resolve => setTimeout(resolve, animationDelay));
            }

            if(!ref || !ref.current){

                return;
            }

            const bounding = !parentRef || !parentRef.current ? ref.current.getBoundingClientRect() :
            parentRef.current.getBoundingClientRect();

            if(bounding.y < window.innerHeight + distanceToTrigger){

                ref.current.style.opacity = "1";


                if(translate){
                    ref.current.style.transform = direction === "horizontal" ?
                    "translateX(0)" : "translateY(0)";

                }



                return;
            }

            ref.current.style.opacity = "0";

            if(!translate){
                return;
            }

            ref.current.style.transform = translate;


        }

        triggerAnimation();

    });




}