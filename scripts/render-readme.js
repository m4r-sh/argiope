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
    # Argiope Palettes

    ${themes.map(theme => md`
      ---

      ### ${theme.name}

      ![${theme.name} Syntax Theme](/docs/images/themes/${theme.image})

    `).join('\n\n')}
  `.toString())
}
