import {TopBar} from "./TopBar";
import Typography from "@material-ui/core/Typography";
import {createUseClassNames} from "theme/useClassesNames";

const {useClassNames} = createUseClassNames()(
    ()=>({
        "root": {
            "display": "flex",
            "flexDirection": "column",
            "justifyContent": "center",
            "textAlign": "center"

        },

        "title": {
            "textTransform": "uppercase",
            "marginTop": 100


        }

    })
)


export const Header = ()=>{

    const {classNames} = useClassNames({})

    return(
        <header className={classNames.root}>
            <TopBar/>
            <Typography className={classNames.title} variant="h2">powerhooks</Typography>
            <Typography variant="h4">A collection of essential React hooks that will enhance the developers experience</Typography>

        </header>

        
    );
}