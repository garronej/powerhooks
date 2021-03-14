import {CodeSnippet} from "../designSystem/CodeSnippet";
import type {Params} from "evt/tools/typeSafety/Params";
import Typography from "@material-ui/core/Typography";
import {createUseClassNames} from "theme/useClassesNames";
import Button from "@material-ui/core/Button";
import {useCallbackFactoryExample} from "../../assets/codeExampleTexts/index";

const {useClassNames} = createUseClassNames()(
    ()=>({
        "root": {
            "display": "flex",
            "flexDirection": "column",
            "alignItems": "center",
            "& h3": {
                "margin": 50
            }

        },
        "button": {
            "margin": 50
        }
    })
);

export const Examples = ()=>{

    const {classNames} = useClassNames({});


    return(
        <div className={classNames.root}>
            <Typography variant="h3">Important Examples :</Typography>

            <Example 
                codeSnippetProps={{
                    "height": 500,
                    "overflow": "scroll",
                    "showLineNumbers": true,
                    "text": useCallbackFactoryExample 
                }}
                title="useCallBackFactory"
                description="
                    This is a mush more powerful version of
                    useCallback witch can handle parameters.
                    Better explanation coming soon!
                "

            />

            <Button 
                className={classNames.button}
                href="https://stackblitz.com/edit/react-ts-jkxthr"
            >
                    See Live Example
            </Button>

        </div>
       
    )
}

const {Example} = (()=>{

    const {useClassNames} = createUseClassNames()(
        ()=>({
            "root":{
                "display": "flex",
                "justifyContent": "space-between",
                "width": 900,

            },
            "description": {
                "width": 400,
                "& h4": {
                    "margin": "30px 0 30px 0"
                }
            }

        })
    )

    type Props = {
        codeSnippetProps: Params<typeof CodeSnippet>;
        description: string;
        title: string;
    }

    const Example = (props: Props)=>{
        const {description, codeSnippetProps, title} = props;
        const {classNames} = useClassNames({});
        return(
            <div className={classNames.root}>
                <CodeSnippet 
                    {...codeSnippetProps}
                />

                <div className={classNames.description}>
                    <Typography variant="h4">{title}</Typography>
                    <Typography variant="body1">
                        {
                            description
                        }
                    </Typography>
                </div>



                
            </div>
        )
    }

    return {Example};


})();