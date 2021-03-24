import type {Props} from "components/App/MainSection";
import useCallbackFactoryCodeSnippet from "./useCallbackFactory.png";
import useConstCallbackSnippet from "./useConstCallback.png";
import useGlobalStateSnippet from "./useGlobalState.png";
import useNamedStateSnippet from "./useNamedState.png";


export const mainSectionData: Props["dataBlocks"] = [
    {
        "imageUrl": useNamedStateSnippet,
        "text": {
            "title": "useNamedState",
            "paragraph": `
                With the original React.useState hook,
                you have to manually set the consistent names "xyz" and "useXyz”,
                Whereas with useNameState you give the name of the state as a parameter
                and deconstruct the value and setter using intellisense.
            `
        }
    },
    {
        "imageUrl": useGlobalStateSnippet,
        "text": {
            "title": "useGlobalState",
            "paragraph": `
                This hook enables to have a state persisted across
                reloads that is accessible through out the entire app
                ant this without involving a provider.
            `
        }

    },
    {
        "imageUrl": useConstCallbackSnippet,
        "text": {
            "title": "useConstCallback",
            "paragraph": `Each time x and/or y have changed since the previous render onClick gets a new reference. 
            Witch is a pain when using React.memo.
            On top of that if an involved state is forgotten in the dependency array
            the callback will encapsulate states that are out of date.
            With useConstCallback, the value of onClick never changes across renders
            yet the values of x ant y are always up to date.`,
        }
    },
    {
        "imageUrl": useCallbackFactoryCodeSnippet,
        "text": {
            "title": "useCallbackFactory",
            "paragraph": `Even if <TodoItem> uses React.memo, each time a 
            item of the list is set to completed every <TodoItem> is 
            re-rendered because of onComplete that changes at every render for every item. 
            Whereas the value returned by onCompleteFactory is always the same for 
            a specific todo. Here we can set an element of the list to 
            completed without re-rendering every items.`,
        }
    }
]