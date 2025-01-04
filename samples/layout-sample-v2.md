## !!scene --duration=2
!text --content="Introducing Layout 👋" --fontSize=48 --animation=fadeInSlideUp

## !!scene --duration=2 --background="linear-gradient(40deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)"
!text --content="Introducing Layout 👋" --fontSize=48 
!transition --type=fade --duration=0.5

## !!scene --duration=5 --background="linear-gradient(40deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)"
!transition --type=wipe --duration=0.5 --direction=from-top
!section
 --direction=column
 --gap=24
 --cols=2
 --rows=2
 --items=(
    !text --content="No Animation" --animation=none --delay=5,
    !text --content="Fade In Only" --animation=fadeInOnly,
    !text --content="Fade In Slide Up" --animation=fadeInSlideUp --delay=1,
    !text --content="Fade In Slide Down" --animation=fadeInSlideDown --delay=2
 )

## !!scene --duration=8 --background="radial-gradient(circle, #237A57 25%, #093028 100%)"
!transition --type=wipe --duration=1 --direction=from-top
!section
 --direction=column
 --gap=24
 --cols=2
 --rows=3
 --footer="This is a footer"
 --header="this is a header"
 --items=(
    !text --content="wobble animations" --animation=wobble,
    !text --content="Slide From Behind" --animation=slideFromBehind --delay=1,
    !text --content="Wave animation" --animation=wave --delay=2,
    !text --content="Bounce In Animation" --animation=bounceIn --delay=4,
    !text --content="Scale In Animation" --animation=scaleIn --delay=5,
    !text --content="Zoom Out Animation" --animation=zoomOut --delay=6
 )

## !!scene --duration=8 --background="radial-gradient(circle, #237A57 25%, #093028 100%)"
!transition --type=wipe --duration=1 --direction=from-top
!section
 --direction=column
 --gap=24
 --cols=2
 --rows=3

 --items=(
    !text --content="wobble animations" --animation=wobble,
    !text --content="Slide From Behind" --animation=slideFromBehind --delay=1,
    !text --content="Wave animation" --animation=wave --delay=2,
    !text --content="Bounce In Animation" --animation=bounceIn --delay=4,
    !text --content="Scale In Animation" --animation=scaleIn --delay=5,
    !text --content="Zoom Out Animation" --animation=zoomOut --delay=6
 )

