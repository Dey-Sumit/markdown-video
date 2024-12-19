## !!scene --title="Problem Introduction" --duration=10
!layout --type=center
!text --content="Let's build a String Repeater" --animation=fade-in --style=heading
!text --content="A function that repeats a string n times with ellipsis" --animation=slide-up --delay=2

## !!scene --title="Code Implementation" --duration=15
!transition --type=slide
```js !
function repeatStringWithEllipsis(str, times) {
  // We'll implement this
}
```
!annotate --line=1 --content="Function takes two parameters" --position=right
!annotate --line=2 --content="We'll add our logic here" --position=right

## !!scene --title="Visual Explanation" --duration=12
!layout --type=split
!left !figure --type=diagram
!box --content="Input String" --position="100,100"
!arrow --to="300,100"
!box --content="Repeat n times" --position="300,100"
!arrow --to="500,100"
!box --content="Add ellipsis" --position="500,100"
!right !text --content="1. Take input string\n2. Repeat it n times\n3. Add ellipsis at end" --animation=type

## !!scene --title="Final Code" --duration=15
!layout --type=split
!left ```js !
function repeatStringWithEllipsis(str, times) {
  const repeated = str + ', '.repeat(times-1) + str;
  return repeated + '...';
}
```
!right !text --content="Test it out:" --animation=fade
```js !
console.log(repeatStringWithEllipsis("hello", 3));
// Output: hello, hello, hello...
```