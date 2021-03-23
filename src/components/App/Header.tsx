import {TopBar} from "./TopBar";
import {createUseClassNames} from "theme/useClassesNames";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import type {Props as TopBarProps} from "./TopBar";




export type Props = {
    title: string;
    subTitle: string;
    headerImageUrl?: string;
    background?: {
        type: "color" | "image";
        colorOrUrlDark: string;
        colorOrUrlLight: string;
    };
    buttons?: {
        title: string;
        linkUrl: string;

    }[];
    topBarProps: TopBarProps;
}



const {useClassNames} = createUseClassNames<{background: Props["background"]}>()(
    (theme, {background})=>({
        "root": {
            "position": "relative",
            "width": "100vw",
            
            "display": "flex",
            "flexDirection": "column",
            "alignItems": "center",
            "& img": {
                "width": 800,
                "marginBottom": 100,
                "opacity": "0.8",
                "@media (max-width: 880px)":{
                    "width": "90%"
                }

            },
            "textAlign": "center",
            "& h3": {
                "marginTop": 50

            },
            "color": theme.palette.type === "dark" ? "white" : "black"
        
            
        },
        "backgroundDiv": {
            "background": (()=>{
                if(background === undefined){
                    return theme.palette.type === "dark" ? 
                        "#05052b" : 
                        theme.custom.typeScriptBlue
                }

                if(background.type === "color"){
                    return theme.palette.type === "dark" ?
                        background.colorOrUrlDark : 
                        background.colorOrUrlLight;
                };

                return `
                    url("${
                        theme.palette.type === "dark" ?
                        background.colorOrUrlDark : 
                        background.colorOrUrlLight
                    }")
                `;

            })(),
            "backgroundRepeat": "no-repeat",
            "backgroundSize": "cover",
            "backgroundPosition": "center",
            "width": "100%",
            "height": "100%",
            "position": "absolute",
            "top": 0,
            "left": 0,
            "zIndex": -1,
            "filter": theme.palette.type === "dark" ? "brightness(0.4)" : "unset"
        },
        "button": {
            "color": theme.palette.type === "dark" ? "white" : "black",
            "margin": 15

        },
        "buttonWrapper":{
            "marginBottom": 50
        }
    })
)



export const Header = (props: Props)=>{
    const {
        headerImageUrl, 
        title, 
        subTitle, 
        buttons, 
        background,
        topBarProps
    } = props;

    const {classNames} = useClassNames({background});

    return (
        <header className={classNames.root}>
            <div className={classNames.backgroundDiv}></div>
            <TopBar 
                {...topBarProps}
            />

            <Typography variant="h4">
                {
                    title
                }
            </Typography>
            <Typography variant="h5">
                {
                    subTitle
                }
            </Typography>

            {
                buttons === undefined ? "" : <div className={classNames.buttonWrapper}>
                    {
                        buttons.map(
                            button => <Button 
                                variant="outlined" 
                                href={button.linkUrl}
                                className={classNames.button}
                                key={JSON.stringify(button.linkUrl + button.title)}
                            >
                                {
                                    button.title
                                }
                            </Button>
                        )
                    }

                </div>

            }

            

            {
                headerImageUrl === undefined ? "" : 
                <img src={headerImageUrl} alt=""/>
            }

            

        </header>

    )
}