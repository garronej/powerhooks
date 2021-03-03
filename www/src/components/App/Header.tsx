import {TopBar} from "./TopBar";
import Typography from "@material-ui/core/Typography";
import {createUseClassNames} from "theme/useClassesNames";
import gifUrl from "../../assets/img/todo.gif";
import {useRef} from "react";
import Divider from "@material-ui/core/Divider";
import {css} from "tss-react";

const {useClassNames} = createUseClassNames()(
    (theme)=>({
        "root": {
            "display": "flex",
            "flexDirection": "column",
            "justifyContent": "center",
            "textAlign": "center",
            "alignItems": "center"

        },

        "title": {
            "textTransform": "uppercase",
            "marginTop": 50


        },
        "installation":{
            "width": 400,
            "border": `solid ${theme.palette.type === "dark" ? "white" : "black"} 1px`,
            "marginTop": 50,
            "padding": 30,
            "& h5": {
                "marginBottom": 30
            },
            "& p": {
                "margin" : "20px 0 20px 0"
            }

        },
        "gif": {
            "width": 800,
            "boxShadow": theme.palette.type === "light" ? "-4px 2px 41px 1px rgba(0,0,0,0.75)" : "",
            "marginTop": 70
        }

    })
)


export const Header = ()=>{


    const {classNames} = useClassNames({})
    const gifRef = useRef<HTMLImageElement>(null);



    return(
        <header className={classNames.root}>
            <TopBar/>
            <Typography className={classNames.title} variant="h2">powerhooks</Typography>
            <Divider className={css({
                "width": 50,
                "margin": 20
            })}/>
            <Typography variant="h4">A collection of essential React hooks<br/>that will enhance the developers experience</Typography>
            <Divider className={css({
                "width": 200,
                "marginTop": 50
            })} />


            <img 
                className={classNames.gif} 
                ref={gifRef} 
                src={gifUrl} 
                alt="gif of todo list with code extract"
            />

            

            
        </header>

        
    );
}