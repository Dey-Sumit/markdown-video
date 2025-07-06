export const DEFAULT_PROJECT_TEMPLATE_WITH_CODE = `# !scene --duration=5 --title=scene --background=indigo
  !text --content="Scene 1 Text" --size=120 --color=white
# !scene --duration=5 --title=scene --background=black
  !transition --type=slide --duration=0.75 --direction=from-bottom
  \`\`\`js ! --theme=midnight --font-size=14
  // !highlight[7:13] --color=red --duration=1
  const example = () => {
   
    // !highlight(1:2) --color=red --duration=1
    const x = 12;
    const y = 15;

    // !highlight(1:2) --color=red --duration=1
    return () => {
    }

    // !highlight --color=red --duration=5
    late if (){ // wtf is late if anyway?
    }
    
  }
  \`\`\`
`;

export const DEFAULT_PROJECT_TEMPLATE = `## !scene --duration=3 --title=intro --background=indigo
!text --content="Hi, This is Markdown to Video" --size=100 --color=white --animation=fadeInOnly

## !scene --duration=3 --title=concept --background=https://plus.unsplash.com/premium_photo-1710409625073-c93ed4592eb8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
!text --content="The idea is" --size=140 --color=#14ae5c --animation=fadeInSlideDown
!transition --type=slide --duration=0.5 --direction=from-bottom

## !scene --duration=4 --title=concept --background=https://plus.unsplash.com/premium_photo-1710409625073-c93ed4592eb8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
!text --content="A video is a combo of SCENES" --size=100 --color=#375041 --animation=fadeInSlideDown
!transition --type=fade --duration=0.5 --direction=from-bottom

## !scene --duration=3 --title=example --background=#e52d27
!text --content="Like this is a SCENE" --size=100 --color=white --animation=fadeInOnly
!transition --type=wipe --duration=0.5 --direction=from-top

## !scene --duration=3 --title=example --background=
!text --content="Another SCENE with Transition" --size=100 --color=white --animation=fadeInOnly
!transition --type=wipe --duration=0.5 --direction=from-top

## !scene --duration=4 --title=with-image --background=#316B98
!text --content="This is a SCENE with Image" --size=90 --color=white --animation=fadeInOnly
!transition --type=slide --duration=0.3
!image --src="https://images.unsplash.com/photo-1642953702322-a5da05d2e36b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHVuc3BhbHNofGVufDB8fDB8fHww" --width=500 --height=500 --delay=2

## !scene --duration=3 --title=with-image --background=https://images.unsplash.com/photo-1563268381-06ddf2b1f46d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
!text --content="Can have layout as well? Yes" --size=100 --color=yellow --animation=fadeInOnly
!transition --type=slide --duration=0.3

## !scene --duration=2.5 --title=layout --background=indigo
!transition --type=wipe --duration=0.3 --direction=from-right
!section --cols=3 --gap=16 --items=(
  !text --content="Col 1 "
  !text --content="Col 2"
  !section --gap=16 --items=(
    !text --content="Row 1"
    !text --content="Row 2"
  )
)

## !scene --duration=3 --title=with-image --background=https://images.unsplash.com/photo-1563268381-06ddf2b1f46d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
!text --content="CodeBlock with animation? Yes" --size=100 --color=white --animation=fadeInOnly
!transition --type=slide --duration=0.5

## !scene --duration=3 --title=magic-demo --background=black
!transition --type=magic --duration=0.75 --direction=from-bottom
\`\`\`js ! --theme=midnight --align=top --fontSize=32
const markdownToVideo = () => {
  const fn = () => {
  // !highlight --color=red --duration=1
    const magicTransition = true
  }
  return fn
}
const generateVideo = markdownVideo()
generateVideo() // ✨ magic ✨
\`\`\`

## !scene --duration=3 --title=explanation --background=black
!transition --type=magic --duration=0.75 --direction=from-bottom
\`\`\`js ! --theme=midnight  --align=top --fontSize=32
const markdownToVideo = () => {
  const fn = () => {
    const magicTransition = true
    // !highlight(1:3) --color=green --duration=1 --delay=1
    const getMagicExplain = () => {
      return "animate only what is changed"
    }
  }
  return fn
}
const generateVideo = markdownVideo()
generateVideo() // ✨ magic ✨
\`\`\`

## !scene --duration=2.5 --title=goodbye --background=black
!transition --type=magic --duration=0.75 --direction=from-bottom
\`\`\`js ! --theme=midnight  --align=top --fontSize=32
const markdownToVideo = () => {
  const fn = () => {
      return "Okay, Bye!"
  }
  return fn
}
const generateVideo = markdownVideo()
generateVideo() // ✨ magic ✨
\`\`\`

## !scene --duration=3 --title=coming-soon --background=https://images.unsplash.com/photo-1525453719223-4e781eb83a4c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
!text --content="Coming Soon" --size=120 --color=white --animation=fadeInOnly
!transition --type=wipe --duration=0.5

## !scene --duration=3 --title=coming-soon --background=https://images.unsplash.com/photo-1525453719223-4e781eb83a4c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
!text --content="Was Coming Soon 🕊️" --size=120 --color=white --animation=none
!transition --type=none --duration=0.3

## !scene --duration=8 --title=coming-soon --background=https://images.unsplash.com/photo-1708549566274-638eb2d2108b?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
!text --content="Is anyone hiring btw? 🙂" --size=120 --color=white --animation=bounceIn
!transition --type=wipe --duration=0.3`;

export const PLAYGROUND_PROJECT_TEMPLATE = `
# !scene --duration=5 --title=scene --background=indigo
  !text --content="Scene 1 Text" --size=120 --color=white

# !scene --duration=5 --title=scene --background=gray
  !text --content="Scene 2 Text" --size=120 --color=white
  !transition --type=wipe --duration=0.3

`;
