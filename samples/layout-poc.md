## !!scene --duration=10

!contentLayout --component=Oxgrid(--gridRows=2 --gridColumns=2 --gap=32)

## !!scene --duration=10

!contentLayout --component=OxFlex(--flexDirection=row --flexWrap=wrap --justifyContent=center --alignItems=center --flexItemsCount=4 --gap=32)

## !!scene --duration=10

!contentLayout --component=OxBento(--gridRows=3 --gridColumns=4 --gap=16 --cells=[])

## !!scene --duration=10

!text --content="Oxgrid" --animation=fadeInSlideUp --presetStyle=fancy() --color=white --delay=0.5

!text --comp=textStack(--content="A grid layout component" --animate=fadeInSlideUp, --content="with rows and columns" --animate=fadeIn) --color=white --delay=1.5 --presetStyle=fancy() --stagger=0.5

!text --comp=textStack
(
--content="A grid layout component" --animate=fadeInSlideUp,
--content="with rows and columns" --animate=fadeIn
)
--color=white --delay=1.5 --presetStyle=fancy() --stagger=0.5

!!text --content="OxFlex" --animation=fadeInSlideUp --presetStyle=fancy() --color=white --delay=0.5
!! text --content="A flex layout component" --animation=fadeInSlideUp --presetStyle=fancy() --color=white --delay=1.5

## !!scene --duration=10

!contentLayout --component=OxFlex(--flexDirection=row --flexWrap=wrap --justifyContent=center --alignItems=center --flexItemsCount=4 --gap=32  
--cells=(
!text --content="OxFlex",
!text --content="A flex layout component",
!text --content="with rows and columns",
!text --content="and wrap",
)
)

## !!scene --duration=10

!contentLayout --component=OxFlex(--flexDirection=row --flexWrap=wrap --justifyContent=center --alignItems=center --flexItemsCount=4 --gap=32  
--cells=(
    --comp=textStack
    (
    --content="A grid layout component" --animate=fadeInSlideUp,
    --content="with rows and columns" --animate=fadeIn
    ),
    --comp=textStack
    (
    --content="A grid layout component" --animate=fadeInSlideUp,
    --content="with rows and columns" --animate=fadeIn
    ),
)
)
