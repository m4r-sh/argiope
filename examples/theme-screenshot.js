import { html, css, svg, classify } from 'zilk'

const { CARD, LIST } = classify('MyCard')

export default ({ title, list }) => html`
  <article class=${CARD}>
    <h2 class=${CARD.TITLE}>${title}</h2>
    <ul class=${LIST}>
      ${list.map(item => html`
        <li class=${LIST.ITEM}>${item}</li>
      `)}
    </ul>
  </article>
`

export const styles = () => css`
  .${CARD} {
    background-color: #fff;
    padding: 2rem;
  }
  .${CARD.TITLE} {
    font-weight: bold;
  }
  .${LIST.ITEM} {
    margin-left: 2rem;
  }
`

export const docs = ({ title, list }) => md`
  ## ${title}

  This is some markdown to match the html view

  ${list.map(item => md`
    - ${item}
  `)}
`
