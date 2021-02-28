import {createUseClassNames} from "theme/useClassesNames";
import {DarkModeSwitch} from "../designSystem/DarkModeSwitch";
import {useIsDarkModeEnabled} from "tools/useIsDarkModeEnabled";
import {useConstCallback} from "powerhooks/useConstCallback";
import {ReactComponent as SvgLogo} from "assets/SVG/physics.svg";
import Button from "@material-ui/core/Button";
import GitHubIcon from '@material-ui/icons/GitHub';

const {useClassNames} = createUseClassNames()(
    ()=>({
        "root": {
            "position": "relative",
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "space-between",
            "padding": "0 20px 0 20px",
            "height": 120
            
        },

        "logo": {
            "height": 100,
            "width": 100,
            "position": "absolute",
            "left": "50%",
            "marginLeft": -50,
            "top": 10

        }
        

    })
)

export const TopBar = ()=>{

    const {classNames} = useClassNames({});

    const {isDarkModeEnabled, setIsDarkModeEnabled} = useIsDarkModeEnabled();


    const toggleDarkMode = useConstCallback(()=>{
        setIsDarkModeEnabled(!isDarkModeEnabled);
    })



    return(
        <nav className={classNames.root}>
            <DarkModeSwitch
                isDarkModeEnabled={isDarkModeEnabled}
                onChange={toggleDarkMode}
            />

            <SvgLogo className={classNames.logo} />

            <div>
                <Button href="https://github.com/garronej/powerhooks">documentation</Button>
                <Button href="https://github.com/garronej/powerhooks">
                    {
                        <GitHubIcon/>
                    }

                </Button>
            </div>

        </nav>
    )
}