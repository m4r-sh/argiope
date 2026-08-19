import { fmt } from '@m4rsh/cones'

const md = fmt

let themes = [
  { name: "Aurantia", image: "argiope-aurantia.png" },
  { name: "Aurantia Neon", image: "argiope-aurantia-neon.png" },
  { name: "Versicolor", image: "argiope-versicolor.png" },
  { name: "Versicolor Neon", image: "argiope-versicolor-neon.png" },
  { name: "Ocyaloides", image: "argiope-ocyaloides.png" },
  { name: "Trifasciata", image: "argiope-trifasciata.png" },
]

writeReadme()

async function writeReadme(){
  Bun.write('./README.md', md`
    # Argiope

    Argiope is a web-centric plugin for editing javascript files with embedded languages.

    [Blog Post](https://m4rsh.com/argiope)

    **Supported Editors**:
    - [Neovim](https://github.com/m4r-sh/argiope.nvim)

    ---

    <figure>
    <img width="300" src="https://m4rsh.com/images/argiope-aurantia-dithered.png" alt="Argiope Aurantia Spider">
    <figcaption align="center">Image by Dave the Bug Guy</figcaption>
    </figure>

    ---

    ## Highlighting

    Argiope takes a unique approach of giving each language its own primary hue, making it easy to distinguish each language at a glance.

    ${themes.map(theme => md`
      ---

      #### ${theme.name}

      ![${theme.name} Syntax Theme](/docs/images/themes/${theme.image})

    `).join('\n\n')}
  `.toString())
}
