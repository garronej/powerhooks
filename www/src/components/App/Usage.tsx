import {CodeSnippet} from "../designSystem/CodeSnippet";
import Typography from "@material-ui/core/Typography";
import {createUseClassNames} from "theme/useClassesNames";

const {useClassNames} = createUseClassNames()(
    (theme)=>({
        "root": {
            "textAlign": "center",
            "display": "flex",
            "flexDirection": "column",
            "alignItems": "center",
            "& h3": {
                "margin": 50
            }

        },
        "code": {
            "width": 600,
            "border": `solid ${theme.palette.type === "dark" ? "white" : "black"} 1px`,
            "padding": 20,
            "& h5":{
                "margin": 20
            }

        }

    })
)

export const Usage = ()=>{

    const {classNames} = useClassNames({});

    return(
        <section className={classNames.root}>

            <Typography variant="h3">Usage: </Typography>
            <div className={classNames.code}>
                <CodeSnippet 
                    showLineNumbers={false} 
                    text="> npm install --save powerhooks"
                />
                <Typography variant="h5">||</Typography>
                <CodeSnippet
                    showLineNumbers={false}
                    text="> yarn add powerhooks"
                />
                <Typography variant="h5">&&</Typography>
                <CodeSnippet
                    showLineNumbers={true}
                    text='import {} from "powerhooks";'
                />
            </div>
        </section>

    )
}