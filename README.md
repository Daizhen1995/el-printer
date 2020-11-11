# el-printer

Print the selected element.

## Quickstart

### Install

npm install --save el-printer or use dist/el-printer.min.js

### Usage

For ES6:

```javascript
import { print } from 'el-printer'
```

For standalone usage:

```html
<script src="../dist/el-printer.js"></script>
```

### Sample

In ES6

```javascript
import { print } from 'el-printer'

print(
  [
    { el: '#abc', pageBreak: false, ignoreElements: ['#child', '#child2'] },
    { el: '#vue', pageBreak: true },
    { el: '#koa', pageBreak: false },
  ],
  0.95
)
```

In html

```html
<script src="../dist/el-printer.js"></script>
<script>
  ElPrinter.print(
    [
      { el: '#abc', pageBreak: false },
      { el: '#vue', pageBreak: true },
      { el: '#koa', pageBreak: false },
    ],
    0.95
  )
</script>
```
