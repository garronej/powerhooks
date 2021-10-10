import * as reactDom from "react-dom";
import {memo} from "react";
import {GlTemplate} from "gitlanding/GlTemplate";
import {GlHeader} from "gitlanding/GlHeader";
import {GlHero} from "gitlanding/GlHero";
import {makeStyles, ThemeProviderDefault} from "gitlanding/theme";
import backgroundUrlDark from "./assets/img/background-dark.jpg";
import backgroundUrlLight from "./assets/img/background-light.jpg";
import heroMp4 from "./assets/videos/hero-video.mp4";
import {GlArticle} from "gitlanding/GlArticle";
import todoListMp4 from "./assets/videos/todo-list.mp4";
import {GlIllustration} from "gitlanding/GlIllustration";
import useCallbackFactoryCodeSnippet from "./assets/img/useCallbackFactory.png"
import useConstCallbackSnippet from "./assets/img/useConstCallback.png"
import useGlobalStateSnippet from "./assets/img/useGlobalState.png"
import {GlSectionDivider} from "gitlanding/GlSectionDivider";
import {GlLogoCard} from "gitlanding/GlCards/GlLogoCard"
import {GlSlider} from "gitlanding/GlSlider";
import gitlandingLogoPng from "./assets/img/gitlanding-logo.png";
import onyxiaLogoSvg from "./assets/svg/OnyxiaLogo.svg";
import tssPng from "./assets/img/tss.png";
import {GlFooter} from "gitlanding/GlFooter";

const useStyles = makeStyles()(
    theme => ({
        "hero": {
            "backgroundImage": `url("${theme.isDarkModeEnabled ? backgroundUrlDark : backgroundUrlLight}")`,
            "backgroundRepeat": "no-repeat",
            "paddingTop": theme.spacing(6),
            "& h3": {
                "color": theme.colors.useCases.typography.textPrimary
            },
            "backgroundSize": "cover",
            "backgroundPositionY": "bottom",

        },

        "title": {
            ...theme.spacing.rightLeft("padding", `${theme.paddingRightLeft}px`),
            "textAlign": "center",
            ...theme.typography.variants["page heading"].style,
            ...theme.spacing.topBottom("margin", 9)

        },
        "section": {
            "& img": {
                "maxWidth": 600
            }
        },
        "card": {
            "width": 800

        }
    })
)

const App = memo(()=>{

    const {classes} = useStyles();

    return <GlTemplate
        header={<GlHeader 
            title="POWERHOOKS"
            links={[
                {
                    "label": "GITHUB",
                    "link": {
                        "href": "https://github.com/garronej/powerhooks"
                    }
                },
                {
                    "label": "DOCUMENTATION",
                    "link": {
                        "href": "https://docs.powerhooks.dev/"
                    }
                }
            ]}
            enableDarkModeSwitch
            githubRepoUrl="https://github.com/garronej/powerhooks"
            githubButtonSize="large"
        />}
        headerOptions={{
            "position": "fixed",
            "isRetracted": "smart"
        }}
        footer={<GlFooter 
            links={[
                {
                    "title": "github",
                    "href": "https://github.com/garronej/powerhooks"
                },
                {
                    "title": "Documentation",
                    "href": "https://docs.powerhooks.dev/"
                }
            ]}
            bottomDivContent="M I T licence"
        />}

    >

            <GlHero
                title="A collection of essential React hooks"
                subTitle="Powerhooks are the hooks you wish were built in React"
                imageSrc={heroMp4}
                className={classes.hero}
                linkToSectionBelowId="firstSection"
                hasImageShadow={true}
            />

            <GlArticle 
                id="firstSection"
                title="Enhance your React Game"
                body={`**React** **Powerhooks** solves an array of problems that would otherwise be very tricky to solve. For instance being able to inject parameters into a callback function with out it having to be re instantiated on every render, or easily getting measurement on a dom element.

Checkout a repository of examples.
                `}
                buttonLabel="Github"
                buttonLink={{
                    "href": "https://www.github.com/thieryw/powerhooks-example"
                }}
                illustration={<GlIllustration 
                    type="image"
                    url={todoListMp4}
                    hasShadow={true}
                />}
                illustrationPosition="left"
            />

            <h1 className={classes.title}>Important examples</h1>

            <GlArticle 
                className={classes.section}
                title="useGlobalState"
                body={`This hook enables us to have a state persisting across
reloads that is accessible through out the entire app,
and this without involving a provider.`}
                illustration={<GlIllustration
                    type="image"
                    url={useGlobalStateSnippet}
                    hasShadow={true}
                />}
                animationVariant="primary"
            />

            <GlSectionDivider />


            <GlArticle 
                className={classes.section}
                title="useConstCallback"

                body= {`Each time x 
and/or y have changed since the previous render **onClick** gets a new reference. 
Witch is a pain when using **React.memo**. 

On top of that if an involved state is forgotten in the dependency array
the callback will encapsulate states that are out of date.
With **useConstCallback**, the value of onClick never changes across renders
yet the values of x ant y are always up to date.`}
                illustration={<GlIllustration
                    type="image"
                    url={useConstCallbackSnippet}
                    hasShadow={true}
                />}
                illustrationPosition="left"
                animationVariant="secondary"
            />

            <GlSectionDivider />

            <GlArticle 
                className={classes.section}
                title="useCallbackFactory"

                body={`Even if **<TodoItem>** uses **React.memo**, each time a 
item of the list is set to completed every **<TodoItem>** is 
re-rendered because of onComplete that changes at every render for every item. 

Whereas the value returned by **onCompleteFactory** is always the same for 
a specific todo. With **useCallbackFactory** we can set an element of the list to 
completed without re-rendering every items.`}
                illustration={<GlIllustration
                    type="image"
                    url={useCallbackFactoryCodeSnippet}
                    hasShadow={true}
                />}
                animationVariant="primary"
            />

    <GlSlider 
        title="Projects that use Powerhooks"
        autoPlayTimeInterval={4}
        slides={[
            <GlLogoCard 
                className={classes.card}
                iconUrls={[gitlandingLogoPng]}
                buttonLabel="Learn More"
                title="Gitlanding"
                paragraph="A Collection of React components for building a stylish landing page for github projects"
                link={{
                    "href": "https://github.com/thieryw/gitlanding"
                }}
            />,
            <GlLogoCard 
                className={classes.card}
                iconUrls={[onyxiaLogoSvg]}
                buttonLabel="Learn More"
                title="Onyxia UI"
                paragraph="A powerful UI tool kit for React based on Material UI"
                link={{
                    "href": "https://github.com/InseeFrLab/onyxia-ui"
                }}
            />,
            <GlLogoCard 
                className={classes.card}
                iconUrls={[tssPng]}
                buttonLabel="Learn More"
                title="TSS React"
                paragraph="A replacement for React jss and for Material UI's makeStyle. It's API is focused on providing maximum type safety and minimum verbosity."
                link={{
                    "href": "https://github.com/garronej/tss-react"
                }}
            />
        ]}
    />

    </GlTemplate>

})


reactDom.render(
    <ThemeProviderDefault>
        <App/>
    </ThemeProviderDefault>,
    document.getElementById("root")
);



