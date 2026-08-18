import page from "./index.html";

const server = Bun.serve({
  routes: {
    "/": page,
  },
});

console.log(`Argiope Palettes: ${server.url}`);
