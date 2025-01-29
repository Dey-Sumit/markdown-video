## !!scene --duration=3 --background=https://images.unsplash.com/photo-1709884735055-3fd875e174fb?q=80&w=3028&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
!text --content="Image as Background" --animation=fadeInSlideUp 


## !!scene --duration=3 --background="linear-gradient(40deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)"
!text --content="Linear Gradient" --animation=fadeInSlideUp --presetStyle=fancy() --color=white  --delay=0.5
!transition --type=slide --duration=0.5 

## !!scene --duration=3 --background="radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 55%, rgba(0,212,255,1) 100%)"
!text --content="Radial Gradient" --animation=fadeInSlideUp --presetStyle=fancy() --color=white --delay=0.35
!transition --type=wipe --duration=0.5 

## !!scene --duration=3 --background=rgba(9,9,121,1)
!text --content="Solid Background" --animation=fadeInSlideUp --presetStyle=fancy() --color=white --delay=0.5
!transition --type=fade --duration=0.5 


## !!scene --duration=7 --background="linear-gradient(40deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)"
!text --content="Gradient + Media" --animation=fadeInSlideUp --presetStyle=fancy() --color=white --delay=0.35
!media --src=https://images.unsplash.com/photo-1709884735055-3fd875e174fb?q=80&w=3028&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D --animation=fadeInSlideUp --duration=5 --delay=2
!transition --type=fade --duration=0.5 

## !!scene --duration=7 --background=https://png.pngtree.com/background/20230411/original/pngtree-park-city-building-illustration-background-picture-image_2387655.jpg
!text --content="Gradient + Media" --animation=fadeInSlideUp --presetStyle=fancy() --color=white --delay=0.35
!media --src=https://png.pngtree.com/background/20230317/original/pngtree-cartoon-cute-illustration-background-picture-image_2149850.jpg --animation=fadeInSlideUp --duration=5 --delay=2
!transition --type=fade --duration=0.5 


## !!scene --duration=7
!contentLayout --component=Oxgrid(--gridRows=2, --gridColumns=2)
type : "contentLayout",
component : {
    name : "Oxgrid",
    data : {
        gridRows : 2,
        gridColumns : 2
    }
}