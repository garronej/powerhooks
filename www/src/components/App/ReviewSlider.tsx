import {useEmblaCarousel} from "embla-carousel/react";
import {createUseClassNames} from "theme/useClassesNames";
import {useConstCallback} from "powerhooks";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Paper from "@material-ui/core/Paper";

const {useClassNames} = createUseClassNames()(
    ()=>({
        "root": {
            "position": "relative",
            "width": 860,
            "marginLeft": "auto",
            "marginRight": "auto",
            "display": "flex",
            "alignItems": "center"

        },
        "viewport":{
            "width": "100%",
            "overflow": "hidden",
            "userSelect": "none",
            "margin": "0 30px 0 30px"

        },
        "container": {
            "display": "flex",
            "alignItems": "center",

        },
        "slide": {
            "position": "relative",
            "minWidth": "100%",
            "padding": "0 30px 0 30px"
           


        },
        "paper": {
            "display": "flex",
            "flexDirection": "column",
            "justifyContent": "center",

            "& p": {
                "textAlign": "center",
                "margin": 40
            },
            "& img": {
                "height": 50,
                "position": "relative",
                "bottom": 20
            }
        }

        
    })
)

export type Props = {
    reviews: {
        description: string;
        logoUrl?: string;
    }[];
    
}

export const ReviewSlider = (props: Props)=>{

    const {reviews} = props;

    const [emblaRef, emblaApi] = useEmblaCarousel({"loop": true});


    const onClickPrev = useConstCallback(()=> emblaApi && emblaApi.scrollPrev());
    const onClickNext = useConstCallback(()=> emblaApi && emblaApi.scrollNext());
    

    const {classNames} = useClassNames({});


    return (
        <div className={classNames.root}>
            <ArrowBackIosIcon onClick={onClickPrev}/>
            <div className={classNames.viewport} ref={emblaRef}>
                <div className={classNames.container}>
                        {
                            reviews.map(
                                review => 
                                <div className={classNames.slide}>
                                    <Paper className={classNames.paper}>
                                        <p>{review.description}</p>
                                        {
                                            review.logoUrl !== undefined ? 
                                            <img src={review.logoUrl} alt="logo"/>: ""
                                        }
                                    </Paper>
                                </div>
                            )

                            
                        }

                </div>
            </div>
            <ArrowForwardIosIcon onClick={onClickNext}/>
        </div>
    )
}



