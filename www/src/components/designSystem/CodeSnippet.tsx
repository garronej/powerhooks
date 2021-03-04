import {CodeBlock, dracula} from "react-code-blocks";
import {memo, useEffect} from "react";
import {useNamedState} from "powerhooks";




type Props = {
    text: string;
    showLineNumbers: boolean;
    animationSpeed?: number;
    height?: number;
    overflow?: "scroll"
}


export const CodeSnippet = memo((props: Props)=>{

    const {showLineNumbers, text, animationSpeed, height, overflow} = props;


    
    const {textData, setTextData} = useNamedState<
            {
                charIndex: number; 
                text: string
            }, 
            "textData"
        >(
            "textData",
            {
                "charIndex": 0,
                "text": ""
            } 
        );
    
    useEffect(()=>{
        if(animationSpeed === undefined){
            return;
        }
        setTimeout(()=>{
            if(textData.charIndex === text.length){
                clearInterval();
                return;
            }

            setTextData({
                "charIndex": textData.charIndex + 1,
                "text": textData.text.concat(text[textData.charIndex])
            });



        }, animationSpeed);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[textData]);

    





    return (
        <div>
            <CodeBlock 

                customStyle={{
                    height: height === undefined ? "" : `${height}px`,
                    overflow: overflow === undefined ? "" : overflow
                }}
                showLineNumbers={showLineNumbers}
                text={animationSpeed === undefined ? text : textData.text}
                theme={dracula}
                language="tsx"
            />
        </div>

    )

});

