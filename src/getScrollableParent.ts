import { assert } from "tsafe/assert";

//NOTE: If the element is scrollable, it returns the element itself.
export function getScrollableParent(
    params: {
        element: HTMLElement;
        doReturnElementIfScrollable: boolean;
    }
): {
    addEventListener: (type: "scroll", listener: () => void) => void;
    removeEventListener: (type: "scroll", listener: () => void) => void;
    getBoundingClientRect: () => DOMRect;
    scrollTop: number;
    clientHeight: number;
    scrollHeight: number;
    scrollTo: typeof window.scrollTo
    style: CSSStyleDeclaration;
    isWindow?: true;
} {

    const { element, doReturnElementIfScrollable } = params;

    if (element === document.documentElement) {

        const element: ReturnType<typeof getScrollableParent> = {
            "addEventListener": (type, listener) => window.addEventListener(type, listener),
            "removeEventListener": (type, listener) => window.removeEventListener(type, listener),
            "getBoundingClientRect": () => document.documentElement.getBoundingClientRect(),
            "scrollTop": NaN,
            "clientHeight": NaN,
            "scrollHeight": NaN,
            "scrollTo": window.scrollTo.bind(window),
            "style": document.body.style,
            "isWindow": true,
        };

        Object.defineProperties(element, {
            "scrollTop": {
                "get": () => window.scrollY
            },
            "clientHeight": {
                "get": () => document.documentElement.clientHeight
            },
            "scrollHeight": {
                "get": () => document.documentElement.scrollHeight
            }
        });

        return element;

    }

    if (doReturnElementIfScrollable && getIsElementScrollable(element)) {
        return element;
    }

    const parentElement = element.parentElement;

    assert(parentElement !== null);

    return getScrollableParent({
        "element": parentElement,
        "doReturnElementIfScrollable": true
    });
}

function getIsElementScrollable(element: HTMLElement): boolean {
    return ["auto", "scroll"].includes(getComputedStyle(element).overflow);
}
