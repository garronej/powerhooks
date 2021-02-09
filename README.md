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

```bash
$ npm install --save powerhooks
```

```typescript
import { myFunction, myObject } from "powerhooks";
```

Specific imports:

```typescript
import { myFunction } from "powerhooks/myFunction";
import { myObject } from "powerhooks/myObject";
```

## Import from HTML, with CDN

Import it via a bundle that creates a global ( wider browser support ):

```html
<script src="//unpkg.com/powerhooks/bundle.min.js"></script>
<script>
    const { myFunction, myObject } = powerhooks;
</script>
```

Or import it as an ES module:

```html
<script type="module">
    import {
        myFunction,
        myObject,
    } from "//unpkg.com/powerhooks/zz_esm/index.js";
</script>
```

_You can specify the version you wish to import:_ [unpkg.com](https://unpkg.com)

## Contribute

```bash
npm install
npm run build
npm test
```
