import {useEvt} from "evt/hooks";
import {Evt} from "evt";


export function useClickOut(params: {
    refs: React.RefObject<HTMLElement>[];
    onClickOut(): void;
}){
    const {onClickOut, refs} = params;




    useEvt(ctx => Evt.from(ctx, window, "click")
        .attach((event)=> {


            for(const ref of refs){

                if(!ref.current) return;

                const [height, top, width, left] = [
                    ref.current.offsetHeight, 
                    ref.current.offsetTop,
                    ref.current.offsetWidth, 
                    ref.current.offsetLeft,
                ]

                const [x, y] = [
                    event.pageX,
                    event.pageY
                ]

                if(
                    x >= left && 
                    x <= left + width &&
                    y >= top &&
                    y <= top + height
                ) return;
            }

            onClickOut();
        })
    ,[]);
        
};