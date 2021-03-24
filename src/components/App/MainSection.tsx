import Typography from "@material-ui/core/Typography";
import {createUseClassNames} from "theme/useClassesNames";
import {css} from "tss-react";

export type Props = {
    dataBlocks: {
        imageUrl: string;
        text: {
            title: string;
            paragraph: string;

        };
    }[];
};

const {useClassNames} = createUseClassNames()(
    ()=>({
        "root": {
            "padding": "40px 0 40px 0",
            "& article": {
                "display": "flex",
                "justifyContent": "center",
                "alignItems": "center",
                "padding": "40px 0 40px 0",
                "& img": {
                    "width": 550,
                    "margin": "0 40px 0 40px",
                    "@media (max-width: 1215px)": {
                        "width": "45%"
                    },
                    "@media (max-width: 895px)": {
                        "width": "80%"
                    }

                },
                "& div": {
                    "width": 500,
                    "margin": "0 40px 0 40px",
                    "& h4": {
                        "marginBottom": 20
                    },
                    "@media (max-width: 895px)": {
                        "marginBottom": 40,
                        "width": "80%"
                    }
                }
            }
        }

    })
)


export const MainSection = (props: Props)=>{

    const {dataBlocks} = props;

    const {classNames} = useClassNames({});

    return (
        <section className={classNames.root}>

            {
                dataBlocks.map(
                    (dataBlock, index) => 
                    <article
                        key={dataBlock.text.title}
                        className={
                            css({
                                "flexDirection": index % 2 !== 0 ? "row-reverse" : "row",
                                "@media (max-width: 895px)": {
                                    "flexDirection": "column"
                                }
                            })
                        }
                    >
                        <div>
                            <Typography variant="h4">
                                <code>
                                        {dataBlock.text.title}
                                </code>
                            </Typography>
                            <Typography>
                                {
                                    dataBlock.text.paragraph
                                }
                            </Typography>
                        </div>
                        <img src={dataBlock.imageUrl} alt="source code"/>

                    </article>
                )
            }

            

        </section>
    )
}