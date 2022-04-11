import { useState, useEffect } from "react";
import { assert } from "tsafe/assert";
import { useDomRect } from "./useDomRect";
import { getScrollableParent } from "./getScrollableParent";

export function useStickyTop() {
    const {
        ref: refSticky,
        domRect: { top: topSticky },
    } = useDomRect<HTMLDivElement>();

    const [top, setTop] = useState<number | undefined>(undefined);

    useEffect(() => {
        /*
			if (top !== undefined) {
				return;
			}
			*/
        if (topSticky === 0) {
            return;
        }

        const stickyElement = refSticky.current;

        assert(stickyElement !== null);

        const { top: topScrollable } = getScrollableParent({
            "element": stickyElement,
            "doReturnElementIfScrollable": false
        }).getBoundingClientRect();

        setTop(topSticky - topScrollable);
    }, [topSticky]);

    return { top, refSticky };
}
