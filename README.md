<p align="center">
    <i>A library of generic React hooks</i>
    <br>
    <br>
    <a href="https://github.com/garronej/powerhooks/actions">
      <img src="https://github.com/garronej/powerhooks/workflows/ci/badge.svg?branch=master">
    </a>
    <a href="https://www.npmjs.com/package/powerhooks">
      <img src="https://img.shields.io/npm/dw/powerhooks">
    </a>
    <a href="https://github.com/garronej/powerhooks/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/powerhooks">
    </a>
</p>
<!--
<p align="center">
  <a href="https://www.powerhooks.dev">Home</a>
  -
  <a href="https://docs.powerhooks.dev">Documentation</a>
</p>
-->

<i>This module is still under development. A real documentation website is coming.</i>  


# Main hooks

## `useConstCallback`

Believe it or not [there is no valid reason to require user to pass in a dependency
array to `useCallback`](https://stackoverflow.com/questions/65890278/why-cant-usecallback-always-return-the-same-ref).

<p align="center">
  <img src="https://www.powerhooks.dev/static/media/useConstCallback.07317f8f.png">
</p>

[Demo playground](https://stackblitz.com/edit/react-ts-fyrwng?file=index.tsx) to show you why it matters.

## `useCallbackFactory`

To avoid re-rendering every list item component when the parent re-renders.

```tsx
//Without powerhook: 

todos.map(todo=> 
    <Todo 
        todo={todo}
        onClick={(a, b)=> onClick(todo, a, b)}
    />
);

//With: 

import { useCallbackFactory } from "powerhooks/useCallbackFactory";

//...

const onClickFactory = useCallbackFactory(
    (
        [todo]: [string],
        [a, b]: [string, number]
    ) => onClick(todo, a, b)
);

todos.map(todo=> 
    <Todo 
        todo={todo}
        onClick={onClickFactory(todo)}
    />
);
```

Let's assume `<TodoItem />` uses `React.memo`, in the example without powerhooks, 
every render of the parent the reference of `onComplete` changes.  
`useCallbackFactory` on the other hand always returns the same function for a given `todo: string`.  

## `useGlobalState`

Create global state persistent across reloads that is accessible through out the entire app, and this without involving a provider.

NOTE: It makes uses of TypeScript's [template literal types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types) to return 
`useIsDarkModeEnabled` based on the `name` parameter (`"isDarkModeEnabled"`).  
How cool is that ?!

`useIsDarkModeEnabled.ts`
```tsx
import { createUseGlobalState } from "powerhooks/useGlobalState";

export const { useIsDarkModeEnabled, evtIsDarkModeEnabled } = createUseGlobalState({
	"name": "isDarkModeEnabled",
	"initialState": (
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	),
	"doPersistAcrossReloads": true
});
```

`MyComponent.tsx`
```tsx
import { useIsDarkModeEnabled } from "./useIsDarkModeEnabled";

export function MyComponent(){

  const { isDarkModeEnabled, setIsDarkModeEnabled }= useIsDarkModeEnabled();

  return (
    <div>
      <p>The dark mode is currently: {isDarkModeEnabled?"enabled":"disabled"}</p>
      <button onClick={()=> setIsDarkModeEnabled(!isDarkModeEnabled)}>
        Click to toggle dark mode
      <button>
    </dvi>
  );

}
```

Optionally, you can track your state an edit them outside of the react tree React
but still trigger refresh when the state is changed.

```ts

import { evtIsDarkModeEnabled } from "./useIsDarkModeEnabled";

//After 4 seconds, enable dark mode, it will triggers re-renders of all the components 
//that uses the state.
setTimeout(
  ()=>{

      evtIsDarkModeEnabled.state = true;

  },
  4000
);

//Print something in the console anytime the state changes:  

evtIsDarkModeEnabled.attach(isDarkModeEnabled=> {
  console.log(`idDarkModeEnabled changed, new value: ${isDarkModeEnabled}`);
});
```

> For SSR (Next.js) use `powerhook/useSsrGlobalState` as showed in `src/test/apps/ssr`.

## `useDomRect`

Measure rendered components in realtime.

```tsx
import { useDomRect } from "powerhooks/useDomRect";

function MyComponent(){

    const { ref, domRect } = useDomRect();

    return (
      <>
        <div ref={ref}> 
          This div is div size's dimensions <br/>
          are determined by it's content 
        </div>
        <div
          style={{
            "width": domRect.width,
            "height": domRect.height
          }}
        > 
          This div is the same size as the first div
        </div>
      </>
    );

}
```

WARNING: Not yet compatible with SSR  

# Used by

- [Onyxia-ui](https://github.com/InseeFrLab/onyxia-ui)
- [Onyxia](https://github.com/InseeFrLab/onyxia-web)
- [Keycloakify](https://github.com/InseeFrLab/keycloakify)
# Development

Start the test SPA

```
npx tsc -w
yarn start_spa
```
