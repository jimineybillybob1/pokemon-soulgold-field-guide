import fs from 'node:fs';

const trophies = JSON.parse(fs.readFileSync('data/trophy-data.json', 'utf8'));
const guide = JSON.parse(fs.readFileSync('data/guide-data.json', 'utf8'));
const errors = [];
const activeTrophies = trophies.trophies || [];
const milestones = trophies.milestones || [];
const ids = new Set();
const pokemonKeys = new Set((guide.pokemon || []).map(pokemon => pokemon.key));

if (activeTrophies.length !== 121) errors.push(`Expected 121 active trophies, found ${activeTrophies.length}.`);
for (const trophy of activeTrophies) {
  if (!trophy.id || ids.has(trophy.id)) errors.push(`Missing or duplicate trophy id: ${trophy.id || '(blank)'}.`);
  ids.add(trophy.id);
  if (!trophy.name || !trophy.description || !trophy.category) errors.push(`Incomplete trophy: ${trophy.id}.`);
  if (!['Bronze', 'Silver', 'Gold', 'Platinum'].includes(trophy.tier)) errors.push(`Invalid tier for ${trophy.id}: ${trophy.tier}.`);
}

if (milestones.length !== 6) errors.push(`Expected 6 trophy milestones, found ${milestones.length}.`);
if (new Set(milestones.map(item => item.count)).size !== milestones.length) errors.push('Duplicate trophy milestone counts.');
for (const milestone of milestones) {
  if (!milestone.reward || !milestone.description) errors.push(`Incomplete milestone at ${milestone.count}.`);
  if (milestone.pokemonKey && !pokemonKeys.has(milestone.pokemonKey)) errors.push(`Unknown reward Pokémon key: ${milestone.pokemonKey}.`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Trophy data valid: ${activeTrophies.length} trophies, ${milestones.length} milestones.`);
