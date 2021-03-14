import {createUseClassNames} from "theme/useClassesNames";
import {DarkModeSwitch} from "../designSystem/DarkModeSwitch";
import {ReactComponent as SvgLogo} from "assets/SVG/physics.svg";
import Button from "@material-ui/core/Button";
import GitHubIcon from '@material-ui/icons/GitHub';
import {GithubStarCount} from "../designSystem/GithubStarCount";
import Divider from "@material-ui/core/Divider";
import {css} from "tss-react";

const {useClassNames} = createUseClassNames()(
    ()=>({
        "root": {
            "position": "relative",
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "space-between",
            "padding": "0 20px 0 20px",
            "width": "100%",
            "height": 120
            
        },

        "logo": {
            "height": 100,
            "width": 100,
            "position": "absolute",
            "left": "50%",
            "marginLeft": -50,
            "top": 10

        },

        "DocButtons": {
            "display": "flex",
            "alignItems": "center",

        }
        

    })
)

export const TopBar = ()=>{

    const {classNames} = useClassNames({});



    return(
        <>
        <nav className={classNames.root}>
            <DarkModeSwitch/>

            <SvgLogo className={classNames.logo} />

            <div className={classNames.DocButtons}>
                <Button href="https://github.com/garronej/powerhooks">documentation</Button>
                <Button className={css({
                    "marginRight": 10
                })} href="https://github.com/garronej/powerhooks">
                    {
                        <GitHubIcon/>
                    }

                </Button>
                <GithubStarCount 
                    size="large"
                />
            </div>

        </nav>
        <Divider className={css({
            "width": "100%"
        })}/>
        </>
    )
}