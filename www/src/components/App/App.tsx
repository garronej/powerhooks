import { createUseClassNames } from "theme/useClassesNames";
import {Header} from "./Header";
import { useIsDarkModeEnabled2 } from "theme/useIsDarkModeEnable2";





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

    const { isDarkModeEnabled, setIsDarkModeEnabled } = useIsDarkModeEnabled2();


   

    return (
        <div className={classNames.root}>


            <Header />
            
            

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