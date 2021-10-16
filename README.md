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
**WARNING**: As for now most of the `powerhooks` aren't compatible with server side rendering.
Do not hesitate to open an issue about it if it's a problem for you.

# Main hooks

## `useConstCallback`

Believe it or not [there is no valid reason to require user to pass in a dependency
array to `useCallback`](https://stackoverflow.com/questions/65890278/why-cant-usecallback-always-return-the-same-ref).

<p align="center">
  <img src="https://www.powerhooks.dev/static/media/useConstCallback.07317f8f.png">
</p>

## `useGlobalState`

Create global state persistent across reloads that is accessible through out the entire app, and this without involving a provider.

NOTE: It makes uses of TypeScript's [template literal types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types) to return 
`useIsDarkModeEnabled` based on the `name` parameter (`"isDarkModeEnabled"`).  
How cool is that ?!

<p align="center">
  <img src="https://user-images.githubusercontent.com/6702424/137588840-b40ec4a4-288e-4d23-981a-9dd834bcd794.png">
</p>

## `useDomRect`

Measure renders components in realtime.

```tsx
import { } from "powerhooks/useDomRect";

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

## `useCallbackFactory`

To avoid re-rendering every list item component when the parent re-renders.

<p align="center">
  <img src="https://www.powerhooks.dev/static/media/useCallbackFactory.6c0887be.png">
</p>

Let's assume `<TodoItem />` uses `React.memo`, in the example without powerhooks, 
every render of the parent the reference of `onComplete` changes.  
`useCallbackFactory` on the other hand always returns the same reference for a given `todo: string`.

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
