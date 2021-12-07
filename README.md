<p align="center">
    <i>The missing builtins hooks</i>
    <br>
    <br>
    <img src="https://github.com/garronej/powerhooks/workflows/ci/badge.svg?branch=master">
    <img src="https://img.shields.io/bundlephobia/minzip/powerhooks">
    <img src="https://img.shields.io/npm/dw/powerhooks">
    <img src="https://img.shields.io/npm/l/powerhooks">
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

<p align="center">
  <img src="https://user-images.githubusercontent.com/6702424/137588840-b40ec4a4-288e-4d23-981a-9dd834bcd794.png">
</p>

WARNING: Not yet compatible with SSR.  

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
