const title = "Argiope";
const attributes = { role: "status", hidden: false };

const page = html`
  <main class="card" aria-label=${title}>
    <h1>${title}</h1>
    ${html`<p>${attributes.role}</p>`}
  </main>
`;

const icon = svg`
  <svg viewBox="0 0 16 16">
    <path d="M0 0h16v16H0z" />
  </svg>
`;

const styles = css`
  .card {
    color: ${page ? "rebeccapurple" : "black"};
  }

  @media (width > 40rem) {
    .card { display: grid; }
  }
`;

const readme = md`
  # ${title}

  - one
  - two

  \`const nested = html\`<b>nested</b>\`;\`
`;

const source = raw.js`
  const value = { title, attributes };
`;

const vertex = glsl`
  uniform mat4 projection;
  void main() { gl_Position = projection * vec4(1.0); }
`;

const shader = wgsl`
  @vertex
  fn main() -> @builtin(position) vec4f { return vec4f(0.0); }
`;

const unknown = txt`
  This stays an ordinary JavaScript template string.
`;

// Deliberately incomplete while typing:
const incomplete = html`<section class=${title}>
