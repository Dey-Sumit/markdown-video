```
/Users/sumitdey/Desktop/products/markdownvideo/node_modules/codehike/dist/mdx/1.1.remark-list-to-section.js
```

```js

function parseName(value) {
    // Remove previous multi check and make it always true
    const multi = true;
    const content = value.slice(1); // Only slice one !
    const name = content === null || content === void 0 ? void 0 : content.split(/\s+/)[0];
    const title = content === null || content === void 0 ? void 0 : content.slice(name.length).trim();
    return {
        name: name || undefined,
        title,
        multi,
    };
}

```

```js

function parseHeading(heading) {
    var _a;
    if (((_a = heading.children[0]) === null || _a === void 0 ? void 0 : _a.type) != "text") {
        throw new Error("Heading must have text");
    }
    const value = heading.children[0].value.trim();
    const multi = true; // Always true now
    const content = value.slice(1); // Only slice one !
    const name = content === null || content === void 0 ? void 0 : content.split(/\s+/)[0];
    const title = content === null || content === void 0 ? void 0 : content.slice(name.length).trim();
    return {
        name: name || DEFAULT_BLOCKS_NAME,
        title,
        multi,
    };
}
```

```js
function splitValues(str) {
  const result = [];
  let current = '';
  let depth = 0;
  let lastWasNewline = false;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    
    if (char === '(') depth++;
    if (char === ')') depth--;
    
    // Modified to only check for single !
    if (lastWasNewline && str.slice(i).startsWith('!')) {
      if (current.trim()) result.push(current.trim());
      current = '';
    }
    
    current += char;
    lastWasNewline = char === '\n' && depth === 0;
  }
  
  if (current.trim()) result.push(current.trim());
  
  return result.filter(val => val.startsWith('!'));
}

```