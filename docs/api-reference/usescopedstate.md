---
description: Synchronize a state among a defined set of components.
---

# useScopedState

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
import { useLanguage, LanguageProvider } from "./useLanguage";

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
export function MyComponent() {

    const { language, setLanguage } = useLanguage();

    return ...;

}
```

