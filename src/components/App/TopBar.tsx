import List from "@material-ui/core/List";
import Link from "@material-ui/core/Link";
import {createUseClassNames} from "theme/useClassesNames";
import {DarkModeSwitch} from "../design-system/DarkModeSwitch";
import {GithubStarCount} from "../design-system/GithubStarCount";


const {useClassNames} = createUseClassNames()(
    ()=>({
        "root": {
            "display": "flex",
            "justifyContent": "space-between",
            "alignItems": "center",
            "padding": 20,
            "width": 1200,
            "@media (max-width: 1250px)":{
                "width": "100%"
            }



        },
        "logo": {
            "width": 50,
            "height": 50
        },
        "link": {
            "color": "white",
            "textTransform": "uppercase",
            "margin": "0 15px 0 15px"
        },
        "linkWrapper": {
            "display": "flex",
            "alignItems": "center"
        },
        "githubAndDarkModeSwitch": {
            "display": "flex",
            "alignItems": "center",
            "margin-left": 20,
            "& button": {
                "marginLeft": 20
            }
        }

    })
)

type Props = {
    Logo: React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
        title?: string | undefined;
    }>
    items: {
        name: string;
        url: string;
    }[];
    githubRepoUrl?: string;

};


export const TopBar = (props: Props)=>{
    const {items, Logo, githubRepoUrl} = props;

    const {classNames} = useClassNames({});
    return (

        <List className={classNames.root} component="nav">
            <Logo className={classNames.logo}/>
            <div className={classNames.linkWrapper}>
                {
                    items.map(
                        item => 
                            <Link className={classNames.link} href={item.url}>
                                {item.name}
                            </Link>

                    )
                }
                <div className={classNames.githubAndDarkModeSwitch}>
                    {
                        githubRepoUrl === undefined ? 
                            "" : 
                            <GithubStarCount
                                repoUrl={githubRepoUrl}
                                size="large"
                            />
                    }
                    <DarkModeSwitch/>
                </div>



            </div>
        </List>

    )
}




