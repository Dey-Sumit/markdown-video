export const DEFAULT_PROJECT_TEMPLATE = `# !scene --duration=5 --title=scene --background=indigo
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

export const PLAYGROUND_PROJECT_TEMPLATE = `
# !scene --duration=5 --title=scene --background=indigo
  !text --content="Scene 1 Text" --size=120 --color=white

# !scene --duration=5 --title=scene --background=gray
  !text --content="Scene 2 Text" --size=120 --color=white
  !transition --type=wipe --duration=0.3

`;
