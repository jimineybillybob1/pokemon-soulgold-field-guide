import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = execFileSync('git', [
  '-C', resolve(root, '.source-intake/upstream-soulgold'),
  'show', 'v1.1.2:src/achievements.c',
], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });

const cleanText = value => value
  .replace(/\\n/g, ' ')
  .replace(/\\"/g, '"')
  .replace(/\\'/g, "'")
  .replace(/\\\\/g, '\\')
  .replace(/\s+/g, ' ')
  .trim();

const strings = new Map();
for (const match of source.matchAll(/static const u8\s+(sText_[A-Za-z0-9_]+)\[\]\s*=\s*_\("((?:\\.|[^"\\])*)"\);/g)) {
  strings.set(match[1], cleanText(match[2]));
}

const start = source.indexOf('static const struct Achievement sAchievements[]');
const end = source.indexOf('STATIC_ASSERT(ARRAY_COUNT(sAchievements)', start);
if (start < 0 || end < 0) throw new Error('Could not locate the v1.1.2 achievement table.');

let category = 'Other trophies';
const trophies = [];
for (const line of source.slice(start, end).split(/\r?\n/)) {
  const comment = line.match(/^\s*\/\/\s*(.+)$/);
  if (comment) { category = cleanText(comment[1]); continue; }
  const match = line.match(/^\s*\{(ACH_[A-Z0-9_]+),\s*(sText_[A-Za-z0-9_]+),\s*(sText_[A-Za-z0-9_]+),\s*ACH_TIER_([A-Z]+),\s*(ACH_COUNTER_[A-Z0-9_]+),\s*(\d+),\s*([A-Z0-9_]+),\s*([A-Za-z0-9_]+)\},/);
  if (!match) continue;
  const [, constant, nameKey, descriptionKey, tier, counter, target, trainer, predicate] = match;
  const name = strings.get(nameKey), description = strings.get(descriptionKey);
  if (!name || !description) throw new Error(`Missing display text for ${constant}`);
  trophies.push({
    id: constant.toLowerCase().replace(/^ach_/, '').replaceAll('_', '-'),
    constant,
    name,
    description,
    tier: tier[0] + tier.slice(1).toLowerCase(),
    category,
    counter: counter === 'ACH_COUNTER_NONE' ? null : counter.replace('ACH_COUNTER_', '').toLowerCase(),
    target: Number(target) || null,
    trainer: trainer === 'TRAINER_NONE_ACH' ? null : trainer,
    predicate: predicate === 'NULL' ? null : predicate,
  });
}

const milestones = [
  { count: 15, reward: 'Shiny Patch', type: 'item', description: 'A consumable that turns one owned Pokémon shiny.' },
  { count: 30, reward: 'Ash-Greninja', type: 'pokemon', pokemonKey: 'greninja-ash', description: 'Its Battle Bond ability allows it to transform after knocking out an opponent.' },
  { count: 45, reward: 'Poipole', type: 'pokemon', pokemonKey: 'poipole', description: 'An Ultra Beast that evolves after learning Dragon Pulse.' },
  { count: 60, reward: 'Eternal Floette', type: 'pokemon', pokemonKey: 'floette-eternal', description: 'A special Floette capable of Mega Evolution with much higher stats.' },
  { count: 75, reward: 'Zarude', type: 'pokemon', pokemonKey: 'zarude', description: 'A mythical Pokémon from the jungle.' },
  { count: 100, reward: 'Original Color Magearna', type: 'pokemon', pokemonKey: 'magearna-original', description: 'The Original Color form of Magearna.' },
];

if (trophies.length !== 121) throw new Error(`Expected 121 active trophies, found ${trophies.length}.`);
const output = {
  meta: {
    gameVersion: '1.1.2',
    source: 'Official v1.1.2 src/achievements.c and achievement-rewards guide',
    sourceUrl: 'https://eemeliri.github.io/soulgold/guides/achievement-rewards/',
    collectionLocation: 'Speak to the gentleman in the Route 40 house to collect milestone rewards and check progress.',
  },
  trophies,
  milestones,
};

writeFileSync(resolve(root, 'data/trophy-data.json'), `${JSON.stringify(output, null, 2)}\n`);
writeFileSync(resolve(root, 'data/trophy-data.js'), `window.TROPHY_GUIDE_DATA = ${JSON.stringify(output)};\n`);
console.log(`Imported ${trophies.length} trophies and ${milestones.length} milestone rewards.`);
