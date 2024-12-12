## !!scene --name=123 --duration=3
!transition --type=slide --duration=0.1 --direction=from-left
!font --size=30 --weight=400 --family=lord
!contentLayout --position=(12,12)  
!zoom --level=1.2 --delay=2 --position=(12,12)
!layout --grid=2*2 
```markdown ! --grid-name=1/1 
# Hello

```
```markdown ! --grid-name=1/2
# Hi

```
# Hey

```
```markdown ! --grid-name=2/2
# Hola

```


// ------
```
Scene Syntax Structure:
- Command: !!scene  
- Arguments: title, duration

Font Syntax Structure:
- Property/Command: !font
- Arguments: size, weight, family

So we refer to:
- !font as a "property" or "command" 
- --size=30 as an "argument" or "flag" of the font command
- !!scene as a "scene command" or "scene declaration"
- --title as an "argument" or "flag" of the scene command

More consistent naming:
- Everything starting with ! or !! → commands
- Everything with -- → arguments/flags
- The whole line → statement
```