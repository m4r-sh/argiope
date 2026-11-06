// Release inputs are resolved Argiope JSON downloads from Studio.
import { readdirSync, readFileSync } from 'node:fs';
const directory = new URL('../themes/', import.meta.url);
const order = ['aurantia', 'versicolor', 'ocyaloides', 'trifasciata'];
export const DEFAULT_THEMES = readdirSync(directory)
  .filter(name => name.endsWith('.argiope.json'))
  .map(name => ({ id: name.slice('argiope-'.length, -'.argiope.json'.length),
    theme: JSON.parse(readFileSync(new URL(name, directory), 'utf8')) }))
  .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id) || a.id.localeCompare(b.id));
