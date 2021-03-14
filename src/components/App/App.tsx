import { createUseClassNames } from "theme/useClassesNames";
import {Header} from "./Header";
import {Usage} from "./Usage";
import {Examples} from "./Examples";
import {ReviewSlider} from "./ReviewSlider";
import {reviews} from "../../assets/reviews";





const { useClassNames } = createUseClassNames<{}>()(
    theme => ({
        "root": {
            "backgroundColor": theme.palette.background.default,
        },
        "text": {
            "color": theme.palette.text.primary
        }
    })
);

export function App() {

    const { classNames } = useClassNames({});

    return (
        <div className={classNames.root}>


            <Header />
            <Usage />
            <Examples />
            <ReviewSlider reviews={reviews} />


            
            

        </div>
    );


}

/*const { Label } = (() => {

    type Props = {
        text: string;
        className?: string;
    };

    const Label = memo((props: Props) => {

        const { text, className } = props;

        return (
            <span
                className={cx(
                    css({
                        "&:hover": {
                            "backgroundColor": "pink"
                        }
                    }),
                    className
                )}>
                {text}
            </span>
        );

    });

    return { Label };


})();*/