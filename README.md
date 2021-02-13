<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/80216211-00ef5280-863e-11ea-81de-59f3a3d4b8e4.png">  
</p>
<p align="center">
    <i></i>
    <br>
    <br>
    <img src="https://github.com/garronej/powerhooks/workflows/ci/badge.svg?branch=develop">
    <img src="https://img.shields.io/bundlephobia/minzip/powerhooks">
    <img src="https://img.shields.io/npm/dw/powerhooks">
    <img src="https://img.shields.io/npm/l/powerhooks">
</p>
<p align="center">
  <a href="https://github.com/garronej/powerhooks">Home</a>
  -
  <a href="https://github.com/garronej/powerhooks">Documentation</a>
</p>

# Install / Import

https://github.com/testing-library/react-hooks-testing-library

https://github.com/InseeFrLab/onyxia-ui/tree/structure_rework/src/app/tools/hooks


```typescript
import { createUseGlobalState } from "powerhooks/useGlobalState";

export const { useIsDarkModeEnabled } = createUseGlobalState(
    "isDarkModeEnabled",
    () => (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    )
);
```