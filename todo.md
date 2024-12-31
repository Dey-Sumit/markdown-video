- [ ] central types for both props media parser and scene props config
- [ ] fix image media transitions
- [ ] support for multiple media types in one scene
- [ ] support for video in robust way (i dont know what i meant b robust)
- [ ] code refactor
- [ ] add tests
- [ ] make codeblock optional
- [ ] add more linter support and quick fixes (like for code block ```js !)




Code Editor : 
 
```
## !!scene --duration= 6 --background=  orange
```
1. Lint:  This is valid , but linter should suggest to remove the extra white spaces after = sign.
2. Quick Fix:  Remove the extra white spaces after = sign.
3. Autocomplete: once ## is typed, it should suggest the scene keyword. with !!scene --duration=5 



---
-----
--presetStyle=fancy 
--presetStyle=fancy()
--presetStyle=fancy(red, 2) // color and padding
--presetStyle=fancy(--color=red,--padding=2) // color and padding

----