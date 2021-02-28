import {memo} from "react";
import Switch from "@material-ui/core/Switch";
import Paper from "@material-ui/core/Paper";
import Brightness7Icon from '@material-ui/icons/Brightness7';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import {createUseClassNames} from "theme/useClassesNames";
import {css, cx} from "tss-react";


const {useClassNames} = createUseClassNames()(

    (theme)=>({
        "root": {
            "width": 100,
            "height": 40,
            "display": "flex",
            "alignItems": "center",
            "backgroundColor": theme.custom.typeScriptBlue
        },




    })
)


export const DarkModeSwitch = memo((props: {
    isDarkModeEnabled: boolean;
    onChange(): void;
    className?: string;
})=>{

    const {isDarkModeEnabled, onChange, className} = props;

    const {classNames} = useClassNames({});


    return (
        <Paper className={cx(classNames.root, className)}>
            <Switch

                checked={isDarkModeEnabled}
                onChange={onChange}
                color={"secondary"}
                
            />
            <div className={css({
                "display": "flex",

                "& svg": {
                    "fill": `${isDarkModeEnabled ? "yellow" : "orange"}`
                }

            })}>
                {
                    isDarkModeEnabled ? <NightsStayIcon/> : <Brightness7Icon/>
                }
            </div>

        </Paper>

    )
});