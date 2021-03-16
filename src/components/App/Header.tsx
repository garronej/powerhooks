import {TopBar} from "./TopBar";
import {ReactComponent as Logo} from "../../assets/SVG/physics.svg";
import {createUseClassNames} from "theme/useClassesNames";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";


const {useClassNames} = createUseClassNames()(
    (theme)=>({
        "root": {
            "width": "100vw",
            "backgroundColor": 
            theme.palette.type === "dark" ? 
            "#05052b" : 
            theme.custom.typeScriptBlue,
            "display": "flex",
            "flexDirection": "column",
            "alignItems": "center",
            "& img": {
                "width": 800,
                "marginBottom": 100

            },
            "& h3": {
                "marginTop": 50

            },
            "color": "white"
        
            
        },
        "button": {
            "color": "white",
            "margin": 15

        },
        "buttonWrapper":{
            "marginBottom": 50
        }
    })
)

type Props = {
    title: string;
    subTitle: string;
    headerImageUrl?: string;
    buttons?: {
        title: string;
        linkUrl: string;

    }[]
}

export const Header = (props: Props)=>{
    const {headerImageUrl, title, subTitle, buttons} = props;

    const {classNames} = useClassNames({});


    return (
        <header className={classNames.root}>
            <TopBar 
                Logo={Logo}
                items={
                    [
                        {
                            "name": "documentation",
                            "url": "https://docs.powerhooks.dev/"
                        },
                        {
                            "name": "github",
                            "url": "https://github.com/garronej/powerhooks"
                        }
                    ]
                }
                githubRepoUrl="https://github.com/garronej/powerhooks"
            />

            <Typography variant="h3">
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