import Link from "@material-ui/core/Link";
import {createUseClassNames} from "theme/useClassesNames";
import type {OverridableComponent} from "@material-ui/core/OverridableComponent";
import type {SvgIconTypeMap} from "@material-ui/core/SvgIcon";
import Typography from "@material-ui/core/Typography";

export type Props = {
    socialMediaItems: {
        name: string;
        url: string;
        logo?: OverridableComponent<SvgIconTypeMap<{}, "svg">> 
    }[];

    items: Omit<Props["socialMediaItems"][number],
        "logo"
    >[];

    licence: string;
}

const {useClassNames} = createUseClassNames()(
    (theme)=>({
        "root": {
            "display": "flex",
            "flexDirection": "column",
            "alignItems": "center",
            "color": theme.palette.type === "dark" ? "#a2a7ab" : "black",
            "& a": {
                "color": theme.palette.type === "dark" ? "#a2a7ab" : "black"
            },
            "backgroundColor": theme.palette.type === "dark" ? theme.custom.backgroundDark : theme.custom.backgroundLight,
            "marginTop": 80
        },
        "items": {
            "margin": 40,
            "& a": {
                "height": 60,
                "display": "flex",
                "flexDirection": "column",
                "justifyContent": "center"
            },

            "@media (max-width: 440px)": {
                "margin": "40px 10px 40px 10px"

            }
            

        },
        "socialMedia": {
            "margin": 40,
            "& svg": {
                "width": 40,
                "height": 40,
                "fill": theme.palette.type === "dark" ? "#a2a7ab" : "black",
                "marginRight": 20
            },
            "& a": {
                "display": "flex",
                "alignItems": "center",
                "height": 60,
            },
            "@media (max-width: 440px)": {
                "margin": "40px 10px 40px 10px"
            }

        },
        "licence": {
            "fontStyle": "italic"
        },
        "wrapper": {
            "display": "flex"
        }
    })
)


export const Footer = (props: Props)=>{

    const {licence, items, socialMediaItems} = props;

    const {classNames} = useClassNames({});

    return(
        <footer className={classNames.root}>

            <div className={classNames.wrapper}>

                <div className={classNames.items}>
                    {
                        items.map(item => <Link
                            href={item.url}
                            key={JSON.stringify(item.url + item.name)}
                        >
                            <Typography>
                                {
                                    item.name
                                }
                            </Typography>

                        </Link>)
                    }
                </div>

                <div className={classNames.socialMedia}>
                    {
                        socialMediaItems.map(item => <Link
                            href={item.url}
                            key={JSON.stringify(item.url + item.name)}
                        >
                            {
                                item.logo === undefined ? "" : <item.logo/>
                            }
                            <Typography>
                                {
                                    item.name
                                }
                            </Typography>

                            
                        </Link>)

                    }

                </div>
            </div>

            <p className={classNames.licence}>
                {
                    licence
                }
            </p>

        </footer>
    )
}