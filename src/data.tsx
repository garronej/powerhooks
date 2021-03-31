/*import {ReactComponent as appStoreLogo} from "./app-store.svg"
import {ReactComponent as photoLogo} from "./photos.svg"
import {ReactComponent as twitterLogo} from "./twitter.svg"*/
import useCallbackFactoryCodeSnippet from "assets/main-section/useCallbackFactory.png";
import useConstCallbackSnippet from "assets/main-section/useConstCallback.png";
import useGlobalStateSnippet from "assets/main-section/useGlobalState.png";
import useNamedStateSnippet from "assets/main-section/useNamedState.png";
import backgroundUrlDark from "assets/header/background-dark.jpg";
import backgroundUrlLight from "assets/header/background-light.jpg";
import {ReactComponent as Logo} from "assets/header/logo.svg";
import bannerUrl from "assets/header/powerhooks_useNamesState.gif";
import type {Props} from "components/App/App";
import { ReactComponent as TwitterSvg } from "assets/svg/twitter.svg";
import { ReactComponent as YouTubeSvg } from "assets/svg/youTube.svg";
import { ReactComponent as RedditSvg } from "assets/svg/reddit.svg";

export const appData: Props = {
    "headerData": {
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
        "subTitle": "The hooks you wish where React builtins",
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
    },

    "mainSectionData": [
        {
            "imageUrl": useNamedStateSnippet,
            "text": {
                "title": "useNamedState",
                "paragraph": `
                    With the original React.useState hook,  
                    you have to manually set the consistent names "xyz" and "useXyz”,
                    Whereas with useNameState you give the name of the state as a parameter
                    and deconstruct the value and setter using intellisense.
                `
            }
        },
        {
            "imageUrl": useGlobalStateSnippet,
            "text": {
                "title": "useGlobalState",
                "paragraph": `
                    This hook enables to have a state persisted across
                    reloads that is accessible through out the entire app
                    ant this without involving a provider.
                `
            }

        },
        {
            "imageUrl": useConstCallbackSnippet,
            "text": {
                "title": "useConstCallback",
                "paragraph": `Each time x and/or y have changed since the previous render onClick gets a new reference. 
                Witch is a pain when using React.memo.
                On top of that if an involved state is forgotten in the dependency array
                the callback will encapsulate states that are out of date.
                With useConstCallback, the value of onClick never changes across renders
                yet the values of x ant y are always up to date.`,
            }
        },
        {
            "imageUrl": useCallbackFactoryCodeSnippet,
            "text": {
                "title": "useCallbackFactory",
                "paragraph": `Even if <TodoItem> uses React.memo, each time a 
                item of the list is set to completed every <TodoItem> is 
                re-rendered because of onComplete that changes at every render for every item. 
                Whereas the value returned by onCompleteFactory is always the same for 
                a specific todo. With useCallbackFactory we can set an element of the list to 
                completed without re-rendering every items.`,
            }
        }
    ],
    "reviewSliderData": undefined,
    "footerData": {
        "leftItems": [
            {
                "name": "Documentation",
                "url": "https://docs.powerhooks.dev/"
            },
            {
                "name": "Github", 
                "url": "https://github.com/garronej/powerhooks"
            }
        ],
    
        "rightItems": [
            {
                "logoSvgComponent": TwitterSvg,
                "name": "Twitter",
                "url": "https://twitter.com/?lang=en"
            },
            {
                "logoSvgComponent": RedditSvg,
                "name": "Reddit",
                "url": "https://www.reddit.com/"
            },
            {
                "logoSvgComponent": YouTubeSvg,
                "name": "YouTube",
                "url": "https://www.youtube.com/"
    
            }
        ],
    
        "licence": "Code licensed under MIT License"
    
    }

}



/*export const reviewSliderData: ReviewSliderProps["reviews"] = [
    {
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam egestas justo nisl, nec dignissim odio pulvinar ut. Sed eget lacus velit. Aenean venenatis, turpis eget accumsan consectetur, tortor augue mattis odio, eget efficitur turpis sapien vel elit.",
        "Logo": appStoreLogo,
        "signature": "Boris Johnson"
    },
    {
        "description": "Aliquam semper eget quam sed iaculis. Pellentesque vitae mollis velit. Maecenas ac odio et sapien viverra gravida vitae sit amet dui. Mauris convallis eros vitae nunc pharetra, non euismod erat lobortis.",
        "Logo": photoLogo,
        "signature": "Vladimir Putin"
    },
    {
        "description": "Sed iaculis, lacus at eleifend porta, purus magna varius arcu, vel tincidunt lorem dolor at massa. Aenean semper et metus ut blandit. Duis finibus tortor in nulla sagittis, et maximus sapien lobortis.",
        "Logo": twitterLogo,
        "signature": "Donald Trump"
    }
];*/


