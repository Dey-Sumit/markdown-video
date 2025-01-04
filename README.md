```
supabase gen types typescript --project-id buhksdehgdjohvrrolij > lib/database.types.ts
```

```
/Users/sumitdey/Desktop/products/markdownvideo/node_modules/codehike/dist/mdx/1.1.remark-list-to-section.js
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
    
    // Handle new values starting with ! or !!
    if (lastWasNewline && (str.slice(i).startsWith('!') || str.slice(i).startsWith('!!'))) {
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