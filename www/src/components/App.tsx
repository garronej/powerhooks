

import { useState, memo } from "react";
import { useIsDarkModeEnabled } from "tools/useIsDarkModeEnabled";
import { createUseClassNames } from "theme/useClassesNames";
import myImgUrl from "assets/img/myimg.png";
import { css, cx } from "tss-react";

const { useClassNames } = createUseClassNames<{}>()(
    theme => ({
        "root": {
            "backgroundColor": theme.palette.background.default,
            "height": "100%",
        },
        "text": {
            "color": theme.palette.text.primary
        }
    })
);

export function App() {

    const { classNames } = useClassNames({});
    const { setIsDarkModeEnabled } = useIsDarkModeEnabled();


    useState(() => {

        setTimeout(() => {

            console.log("toggling dark mode");

            setIsDarkModeEnabled(setIsDarkModeEnabled => !setIsDarkModeEnabled);

        }, 5000);

    });


    return (
        <div className={classNames.root}>
            <img src={myImgUrl} alt="" />
            <Label
                text="Hello World"
                className={classNames.text}
            />

        </div>
    );


}


const { Label } = (() => {

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


})();