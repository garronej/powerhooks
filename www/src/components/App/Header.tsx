import {TopBar} from "./TopBar";
import Typography from "@material-ui/core/Typography";
import {createUseClassNames} from "theme/useClassesNames";
import {CodeSnippet} from "../designSystem/CodeSnippet";
import {useIsDarkModeEnabled} from "theme/useIsDarkModeEnabled";

const {useClassNames} = createUseClassNames<{isDarkModeEnabled: boolean}>()(
    (...[, {isDarkModeEnabled}])=>({
        "root": {
            "display": "flex",
            "flexDirection": "column",
            "justifyContent": "center",
            "textAlign": "center",
            "alignItems": "center"

        },

        "title": {
            "textTransform": "uppercase",
            "marginTop": 100


        },
        "installation":{
            "width": 400,
            "border": `solid ${isDarkModeEnabled ? "white" : "black"} 1px`,
            "marginTop": 50,
            "padding": 30,
            "& h5": {
                "marginBottom": 30
            },
            "& p": {
                "margin" : "20px 0 20px 0"
            }

        }

    })
)


export const Header = ()=>{

    const {isDarkModeEnabled} = useIsDarkModeEnabled();

    const {classNames} = useClassNames({isDarkModeEnabled})

    return(
        <header className={classNames.root}>
            <TopBar/>
            <Typography className={classNames.title} variant="h2">powerhooks</Typography>
            <Typography variant="h4">A collection of essential React hooks that will enhance the developers experience</Typography>

            <div className={classNames.installation}>
                <Typography variant="h5">Installation :</Typography>
                <CodeSnippet 
                    showLineNumbers={false}
                    text="> npm install -save powerhooks"
                    animationSpeed={20}
                />

                <Typography>Or</Typography>

                <CodeSnippet 
                    showLineNumbers={false}
                    text="> yarn add powerhooks"
                    animationSpeed={20}
                />

            </div>

            
        </header>

        
    );
}