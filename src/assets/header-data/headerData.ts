import type {Props as HeaderProps} from "components/App/Header";
import backgroundUrlDark from "./background-dark.jpg";
import backgroundUrlLight from "./background-light.jpg";
import {ReactComponent as Logo} from "./logo.svg";
import bannerUrl from "./powerhooks_useNamesState.gif";


export const headerData: HeaderProps = {
    "background": {
        "type": "image",
        "colorOrUrlDark": backgroundUrlDark,
        "colorOrUrlLight": backgroundUrlLight,
    },
    "buttons": [
        {
            "title": "learn more",
            "linkUrl": "https://docs.powerhooks.dev/"
        },
        {
            "title": "try it",
            "linkUrl": "https://stackblitz.com/edit/react-ts-jkxthr"
        }
    ],
    "headerImageUrl": bannerUrl,
    "title": "POWERHOOKS",
    "subTitle": "The hooks that you wish where contained with in React",
    "topBarProps": {
        "Logo": Logo,
        "githubRepoUrl": "https://github.com/garronej/powerhooks",
        "items": [
            {
                "name": "documentation",
                "url": "https://docs.powerhooks.dev/"
            },
            {
                "name": "github",
                "url": "https://github.com/garronej/powerhooks"
            }

        ],
    }
}


