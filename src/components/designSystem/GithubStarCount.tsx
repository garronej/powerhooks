import {css} from "tss-react";

type Props = {
    size: "normal" | "large";
}


export const GithubStarCount = (props: Props)=>{

    const {size} = props;



    return(
        <div className={css({
            "& span": {
                "display": "flex",
                "alignItems": "center"
            }


        })}>
            <a 
                className="github-button" 
                href="https://github.com/garronej/powerhooks" 
                data-color-scheme={
                    `
                        no-preference: light; 
                        light: light; 
                        dark: light;
                    `
                }
                data-icon="octicon-star" 
                data-size={size === "large" ? "large" : ""} 
                data-show-count="true" 
                aria-label="Star garronej/powerhooks on GitHub"
            >
                Star
            </a>



        </div>
    )

}