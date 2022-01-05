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
import {GlIllustration} from "gitlanding/GlIllustration";
import useCallbackFactoryCodeSnippet from "./assets/img/useCallbackFactory.png"
import useConstCallbackSnippet from "./assets/img/useConstCallback.png"
import useGlobalStateSnippet from "./assets/img/useGlobalState.png"
import {GlSectionDivider} from "gitlanding/GlSectionDivider";
import {GlLogoCard} from "gitlanding/GlCards/GlLogoCard"
import {GlSlider} from "gitlanding/GlSlider";
import gitlandingLogoPng from "./assets/img/gitlanding-logo.png";
import onyxiaLogoSvg from "./assets/svg/OnyxiaLogo.svg";
import {GlFooter} from "gitlanding/GlFooter";
import useDomRectSnippet from "./assets/img/useDomRect.png";

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
            "marginTop": theme.spacing(8),
            "marginBottom": theme.spacing(6)
        },
        "section": {
            "& img": {
                "maxWidth": 700
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


            <h1 className={classes.title}>Main hooks</h1>

            <GlArticle 
                id="firstSection"
                className={classes.section}
                title="useConstCallback"
                body={`Believe it or not there is no valid reason to require user to pass in a dependency array to \`useCallback\`.`}
                illustration={<GlIllustration
                    type="image"
                    url={useConstCallbackSnippet}
                    hasShadow={true}
                />}
                hasAnimation={true}
            />


            <GlSectionDivider />

            <GlArticle 
                className={classes.section}
                title="useCallbackFactory"
                illustrationPosition="left"

                body={`To avoid re-rendering every list item component when the parent re-renders.

Let's assume \`<TodoItem />\` uses \`React.memo\`, in the example without powerhooks, every render of the parent the reference of \`onComplete\` changes.
\`useCallbackFactory\` on the other hand always returns the same function for a given \`todo: string\`.

                `}
                illustration={<GlIllustration
                    type="image"
                url={useCallbackFactoryCodeSnippet}
                hasShadow={true}
            />}
            hasAnimation={true}
        />

        <GlSectionDivider />

        <GlArticle
            className={classes.section}
            title="useGlobalState"
            body={`Create global state persistent across reloads that is accessible through out the entire app, and this without involving a provider.

NOTE: It makes uses of TypeScript's template literal types to return \`useIsDarkModeEnabled\` based on the \`name\` parameter (\`"isDarkModeEnabled"\`).
How cool is that ?!


            `}
            illustration={<GlIllustration
                type="image"
                url={useGlobalStateSnippet}
                hasShadow={true}
            />}
            hasAnimation={true}
        />
        <GlSectionDivider />

        <GlArticle
            className={classes.section}
            title="useDomRect"
            illustrationPosition="left"
            body={`Measure rendered components in realtime.

WARNING: Not yet compatible with SSR
            `}
            illustration={<GlIllustration
                type="image"
                url={useDomRectSnippet}
                hasShadow={true}
            />}
            hasAnimation={true}
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
            ]}
        />

    </GlTemplate>

})


reactDom.render(
    <ThemeProviderDefault>
        <App />
    </ThemeProviderDefault>,
    document.getElementById("root")
);



