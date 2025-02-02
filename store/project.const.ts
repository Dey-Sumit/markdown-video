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
export const DEFAULT_PROJECT_TEMPLATE = `# !scene --duration=5 --title=scene --background=indigo
  !text --content="Scene 1 Text" --size=120 --color=white
# !scene --duration=5 --title=scene --background=black
  !transition --type=slide --duration=0.75 --direction=from-bottom
  \`\`\`js ! --theme=midnight --font-size=14
  // !highlight[7:13] --color=red --duration=1
  const example = () => {
   
     
  }
  \`\`\`
`;

export const PLAYGROUND_PROJECT_TEMPLATE = `
# !scene --duration=2
  !text --content="Making Video Should be" --color=white

# !scene --duration=1
  !text --content="Easy 🍃 " --animation=none

# !scene --duration=1
  !text --content="Fast ⚡" --animation=none

# !scene --duration=1
  !text --content="and Simple ✨" --animation=none

# !scene --duration=7 --background="linear-gradient(40deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)"
  !transition --type=wipe --duration=0.3
  !text --content="you write text" --color=white
  !image --src="https://pub-9b7d7c778ddd4db8b6178ed5dceea39d.r2.dev/product-demo-text-showcase.jpg" --delay=2 --height=800

# !scene --duration=7 --background="linear-gradient(40deg, #237A57 0%,  #093028 100%)"
  !transition --type=fade --duration=0.3
  !text --content="and you get the video" --color=white --order=1
  !section --cols=1 --gap=16 --order=2 --background="linear-gradient(40deg, #093028 0%, #237A57 100%)" --items=(
    !text --content="like the one you are seeing right now"
  )

`;
