import { useEvt } from "evt/hooks";
import { useState } from "react";
import { Evt } from "evt";
import memoize from "memoizee";

export const getBrowserFontSizeFactor = memoize(() => {

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const rootElement = document.querySelector("html")!;

    const { fontSize } = rootElement.style;

    rootElement.style.fontSize = "100%";

    const browserFontSizeFactor =
        parseInt(
            window.getComputedStyle(rootElement, null)
                .getPropertyValue("font-size")
                .replace(/px$/, "")
        ) / 16;

    rootElement.style.fontSize = fontSize;

    return browserFontSizeFactor;

});

export function useBrowserFontSizeFactor() {

    const [browserFontSizeFactor, setBrowserFontSizeFactor] = useState(() => (
        getBrowserFontSizeFactor.clear(),
        getBrowserFontSizeFactor()
    ));

    useEvt(
        ctx =>
            Evt.from(ctx, window, "focus")
                .attach(() => {
                    getBrowserFontSizeFactor.clear();
                    setBrowserFontSizeFactor(getBrowserFontSizeFactor());
                }),
        []
    );

    return { browserFontSizeFactor };
}
