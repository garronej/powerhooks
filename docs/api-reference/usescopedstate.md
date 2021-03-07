---
description: Synchronize a state among a defined set of components.
---

# useScopedState

Using this hook is the equivalent of using `useState()` and sharing the state with other components. 

The usual way to acheive this is though React Context or using redux but it comes with a lot of boilerplate.

`useLanguage.ts`

```typescript
import { createUseScopedState } from "powerhooks/useScopedState";

export type Language = "en" | "fr" | "es";

function getDefaultLanguage(): Language{
    return "en";
}

export const { useLanguage, LanguageProvider } = createUseScopedState(
    "language",
    getDefaultLanguage
);
```

`Container.tsx`

```jsx
import { LanguageProvider } from "./useLanguage";

export function Container() {

    return (
        <>
            <LanguageProvider>
                <MyComponent />
            </LanguageProvider>
            <LanguageProvider initialState="fr">
                <MyComponent />
            </LanguageProvider>
        </>
    );

}
```

`MyComponent.tsx`

```jsx
import { useLanguage } from "./useLanguage";

export function MyComponent() {

    const { language, setLanguage } = useLanguage();

    return ...;

}
```

