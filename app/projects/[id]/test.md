
# Mask Reveal Animation

## !!steps 1

!duration 6s 
!transition name:fade duration:3s
!fontUtils fontSize:54px
!codeBlockUtils centered


```js ! preparing assets
const IMAGES = {
// !callout[/BASE_IMAGE/] visible at first
  BASE_IMAGE: "image-link-1.webp",
// !callout[/MASKED_IMAGE/] visible on mouse hover
  MASKED_IMAGE: "image-link-2.webp",
};
```

## !!steps 2
!duration 4.5s
!transition name:slide-from-top duration:3s delay:500ms
!fontUtils fontSize:38px
!codeBlockUtils centered

```js !
const Page = () => {
  return (
    <main className="">
      // main component goes here
    </main>
  )
}
```

## !!steps 3
!duration 4.5s
!transition name:magic 
!fontUtils fontSize:38px
!codeBlockUtils centered

```js !
const Page = () => {
  return (
    // !mark[5:60]
    <main className="grid h-screen place-items-center p-10">
      // main component goes here
    </main>
  )
}
```
