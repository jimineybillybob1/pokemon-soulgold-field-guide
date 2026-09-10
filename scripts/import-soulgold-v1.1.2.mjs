import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(root, 'sources', 'reference', 'soulgold-v1.1.2');
const dataRoot = path.join(sourceRoot, 'data');
const pokeapiIndexFile = path.join(root, 'sources', 'reference', 'pokeapi-pokemon-index.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};
const title = value => String(value || '').replace(/^TYPE_|^DAMAGE_CATEGORY_|^POCKET_/, '').toLowerCase().split(/[_-]/).map(part => part ? part[0].toUpperCase() + part.slice(1) : '').join(' ');
const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const unique = values => [...new Set(values.filter(value => value != null))];
const relativeAsset = value => String(value || '').split('?')[0].replace(/^sprites\//, '');

if (!fs.existsSync(path.join(dataRoot, 'species.json'))) {
  throw new Error('Frozen SoulGold v1.1.2 source snapshot is missing.');
}

async function loadPokeapiIndex() {
  if (fs.existsSync(pokeapiIndexFile)) return read(pokeapiIndexFile);
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000');
  if (!response.ok) throw new Error(`PokeAPI index request failed: HTTP ${response.status}`);
  const payload = await response.json();
  const records = payload.results.map(entry => ({
    name: entry.name,
    id: Number(String(entry.url).match(/\/(\d+)\/?$/)?.[1])
  })).filter(entry => entry.name && Number.isInteger(entry.id));
  write(pokeapiIndexFile, {
    generatedAt: new Date().toISOString(),
    purpose: 'Resolve the exact hack form allowlist before the pinned baseline fetch.',
    records
  });
  return read(pokeapiIndexFile);
}

function copyAsset(sourceRelative, destinationRoot) {
  if (!sourceRelative) return '';
  const clean = relativeAsset(sourceRelative);
  const source = path.join(sourceRoot, 'sprites', clean);
  const destination = path.join(root, destinationRoot, clean.replace(/^(pokemon|items|trainers)[\\/]/, ''));
  if (!fs.existsSync(source)) return '';
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
  return path.relative(root, destination).replaceAll('\\', '/');
}

const typeColours = {
  Normal: '#9b9b6a', Fire: '#ef6c33', Water: '#4f82dd', Electric: '#f2c934', Grass: '#65ad50', Ice: '#74c8c2',
  Fighting: '#b5362f', Poison: '#963c96', Ground: '#d6b85f', Flying: '#9b83df', Psychic: '#e24f7c', Bug: '#97a629',
  Rock: '#a68e36', Ghost: '#675286', Dragon: '#6434dc', Dark: '#665047', Steel: '#a6a6ba', Fairy: '#d685b3', Stellar: '#7b91a8'
};

const species = read(path.join(dataRoot, 'species.json'));
const movesRaw = Object.values(read(path.join(dataRoot, 'moves.json'))).filter(move => move.id > 0);
const abilitiesRaw = Object.values(read(path.join(dataRoot, 'abilities.json'))).filter(ability => ability.constant !== 'ABILITY_NONE');
const itemsRaw = read(path.join(dataRoot, 'items.json'));
const trainersRaw = read(path.join(dataRoot, 'trainers.json'));
const encountersRaw = read(path.join(dataRoot, 'encounters.json'));
const machinesRaw = read(path.join(dataRoot, 'machines.json'));
const common = read(path.join(dataRoot, 'common.json'));
const legendaryGuideMarkdown = fs.readFileSync(path.join(sourceRoot, 'guides', 'legendaries.md'), 'utf8');
const pokeapiIndex = await loadPokeapiIndex();
const pokeapiByName = new Map(pokeapiIndex.records.map(entry => [entry.name, entry]));
const supportedPokeapi = species.map(entry => entry.slug).filter(key => pokeapiByName.has(key));
const customFormKeys = species.map(entry => entry.slug).filter(key => !pokeapiByName.has(key));

const abilityByConstant = new Map(abilitiesRaw.map(entry => [entry.constant, entry]));
const moveByConstant = new Map(movesRaw.map(entry => [entry.constant, entry]));
const speciesByConstant = new Map(species.map(entry => [entry.constant, entry]));
const firstByDex = new Map();
species.forEach(entry => { if (!firstByDex.has(entry.dex)) firstByDex.set(entry.dex, entry.constant); });
const pokemonId = new Map(species.map(entry => [entry.constant, pokeapiByName.get(entry.slug)?.id || 200000 + entry.id]));
const friendlyKey = entry => entry.slug === slug(entry.name) ? entry.name : title(entry.slug);

const abilities = abilitiesRaw.map((ability, index) => ({
  // Keep source-only abilities clear of PokeAPI numeric IDs; matching names/keys
  // still merge with the pinned baseline definition before this full override wins.
  id: 100000 + index,
  key: ability.slug,
  name: ability.name,
  description: ability.description,
  source: 'SoulGold v1.1.2 abilities export'
}));

const moves = movesRaw.map(move => {
  const type = title(move.type);
  return {
    id: move.id,
    key: move.slug,
    name: move.name,
    type,
    typeColour: typeColours[type] || '#78828f',
    category: title(move.category),
    power: move.power === 0 ? null : move.power,
    accuracy: move.accuracy === 0 ? null : move.accuracy,
    pp: move.pp,
    priority: move.priority || 0,
    description: move.description,
    fallbackDefinition: false,
    source: 'SoulGold v1.1.2 moves export'
  };
});

const unresolvedMoves = new Set();
const moveId = constant => {
  const found = moveByConstant.get(constant);
  if (!found) unresolvedMoves.add(constant);
  return found?.id;
};

const pokemon = species.map(entry => {
  const detail = read(path.join(dataRoot, 'species-details', `${entry.slug}.json`));
  // The source exports both type slots; monotypes repeat their sole type.
  const types = unique(entry.types.map(title));
  const abilityConstants = unique([...(entry.regularAbilities || []), ...(entry.hiddenAbilities || []), ...(entry.innates || [])]);
  const mappedAbilities = abilityConstants.map((constant, index) => {
    const definition = abilityByConstant.get(constant);
    return definition ? {
      name: definition.name,
      description: definition.description,
      hidden: (entry.hiddenAbilities || []).includes(constant),
      innate: (entry.innates || []).includes(constant),
      slot: index + 1
    } : null;
  }).filter(Boolean);
  const learnset = {
    level: (detail.levelUp || []).map(record => ({ moveId: moveId(record.move), level: Number(record.level) })).filter(record => record.moveId),
    tm: unique((detail.tmhm || []).map(moveId)).sort((a, b) => a - b),
    tutor: unique((detail.tutors || []).map(moveId)).sort((a, b) => a - b),
    egg: unique((detail.eggMoves || []).map(moveId)).sort((a, b) => a - b),
    other: []
  };
  const normalSprite = copyAsset(entry.sprite, 'assets/pokemon/soulgold');
  const shinySprite = copyAsset(detail.shinySprite, 'assets/pokemon/soulgold');
  return {
    id: pokemonId.get(entry.constant),
    dexId: entry.dex,
    gameDexId: firstByDex.get(entry.dex) === entry.constant ? entry.dex : null,
    sourceKey: entry.slug,
    key: entry.slug,
    name: entry.name,
    isDefaultForm: firstByDex.get(entry.dex) === entry.constant,
    types,
    typeColours: types.map(type => typeColours[type] || '#78828f'),
    stats: [entry.stats.hp, entry.stats.atk, entry.stats.def, entry.stats.spe, entry.stats.spa, entry.stats.spd],
    bst: entry.bst,
    abilities: mappedAbilities,
    learnset,
    evolutions: (detail.evolutions || []).map(edge => ({
      targetId: pokemonId.get(edge.target),
      method: edge.label || [title(edge.method), edge.param, ...(edge.conditions || [])].filter(Boolean).join(' ')
    })).filter(edge => edge.targetId),
    heldItems: detail.heldItems || [],
    sprite: normalSprite,
    shinySprite,
    fallbackDefinition: false,
    source: 'SoulGold v1.1.2 species and species-details exports'
  };
});

function encounterRecord(mon, method, rod = '') {
  const sourceSpecies = speciesByConstant.get(mon.species);
  if (!sourceSpecies) return null;
  return {
    pokemon: friendlyKey(sourceSpecies),
    method,
    ...(rod ? { rod } : {}),
    level: mon.minLevel === mon.maxLevel ? String(mon.minLevel) : `${mon.minLevel}-${mon.maxLevel}`,
    rarity: mon.rate,
    source: 'SoulGold v1.1.2 encounters export'
  };
}

const locations = encountersRaw.map(location => {
  const day = [];
  const night = [];
  const allDay = !location.hasTimeVariants;
  for (const variant of location.variants || []) {
    const target = allDay || variant.time === 'Day' ? day : night;
    for (const method of variant.methods || []) {
      if (method.method === 'Fishing Mons') {
        method.mons.forEach((mon, index) => {
          const rod = index < 2 ? 'Old Rod' : index < 5 ? 'Good Rod' : 'Super Rod';
          const record = encounterRecord(mon, 'Fish', rod);
          if (record) target.push(record);
        });
      } else {
        const normalized = { 'Land Mons': 'Wild', 'Water Mons': 'Surf', 'Rock Smash Mons': 'Rock' }[method.method];
        if (!normalized) continue;
        method.mons.forEach(mon => {
          const record = encounterRecord(mon, normalized);
          if (record) target.push(record);
        });
      }
    }
  }
  return { name: location.name, periodModel: allDay ? 'all-day' : 'split', day, night };
});

const locatedItems = itemsRaw.map(item => ({
  id: item.id,
  key: item.slug,
  name: item.name,
  description: item.description,
  category: title(item.pocket),
  sprite: copyAsset(item.itemIcon, 'assets/items/soulgold'),
  locations: (item.locations || []).map(location => `${location.map} (${location.source})`),
  costs: [],
  move: null,
  fallbackDefinition: false,
  source: 'SoulGold v1.1.2 items export'
}));
const locatedItemNames = new Set(locatedItems.map(item => slug(item.name)));
const heldItemDefinitions = new Map();
for (const trainer of trainersRaw) for (const member of trainer.party || []) {
  if (!member.itemName || locatedItemNames.has(slug(member.itemName)) || heldItemDefinitions.has(slug(member.itemName))) continue;
  heldItemDefinitions.set(slug(member.itemName), {
    key: slug(member.itemName),
    name: member.itemName,
    description: member.itemDescription,
    sprite: member.itemIcon
  });
}
const items = [...locatedItems, ...[...heldItemDefinitions.values()].map((item, index) => ({
  id: 300000 + index,
  key: item.key,
  name: item.name,
  description: item.description,
  category: 'Held Item',
  sprite: copyAsset(item.sprite, 'assets/items/soulgold'),
  locations: [],
  costs: [],
  move: null,
  fallbackDefinition: false,
  source: 'SoulGold v1.1.2 trainer export held-item definition'
}))];

const acquisition = { wild: [], safari: [], raids: [], special: [], gifts: [], trades: [], fossils: [], unobtainable: [] };
const structuredStaticEncounters = [];
const oddEggPokemon = [];
for (const entry of species) {
  const detail = read(path.join(dataRoot, 'species-details', `${entry.slug}.json`));
  for (const location of detail.locations || []) {
    if (['Land Mons', 'Water Mons', 'Fishing Mons', 'Rock Smash Mons'].includes(location.method)) continue;
    const base = {
      pokemon: friendlyKey(entry),
      location: location.name,
      method: location.method,
      period: location.time ? location.time.toLowerCase() : 'any',
      level: location.minLevel == null ? '' : location.minLevel === location.maxLevel ? String(location.minLevel) : `${location.minLevel}-${location.maxLevel}`,
      rarity: location.rate,
      details: location.method,
      source: 'SoulGold v1.1.2 species-details export'
    };
    if (location.method === 'Legendary encounter') {
      structuredStaticEncounters.push({ entry, location, base });
    } else if (location.method === 'Hidden Grotto') {
      acquisition.special.push({ ...base, method: 'Hidden Grotto', details: 'Conditional on the daily Grotto roll: 60% Pokémon, then equal odds among the four listed species; two perfect IVs and Hidden Ability guaranteed.' });
    } else if (/Odd Egg/i.test(location.method)) {
      oddEggPokemon.push(friendlyKey(entry));
    } else if (/Fossil|Old Amber/i.test(location.method)) {
      acquisition.fossils.push(base);
    } else if (/trade/i.test(location.method)) {
      acquisition.trades.push(base);
    } else if (/Gift|Gachapon|Exchange/i.test(location.method)) {
      acquisition.gifts.push(base);
    } else {
      acquisition.special.push(base);
    }
  }
}

function markdownGuideSections(markdown) {
  const sections = new Map();
  const prepared = `${markdown.trim()}\n#### __END__\n`;
  const matches = [...prepared.matchAll(/^####\s+(.+?)\r?\n([\s\S]*?)(?=^####\s+)/gm)];
  for (const match of matches) {
    if (match[1] === '__END__') continue;
    const body = match[2]
      .replace(/^\[\/?spoiler[^\]]*\]\s*$/gm, '')
      .replace(/^[-*]\s+/gm, '• ')
      .replace(/^\d+\.\s+/gm, '• ')
      .replace(/\s+/g, ' ')
      .trim();
    sections.set(match[1].trim(), body);
  }
  return sections;
}
const legendarySections = markdownGuideSections(legendaryGuideMarkdown);
const legendaryRules = [
  ['Articuno', ['articuno'], 'Snowtop Mountain'],
  ['Zapdos', ['zapdos'], 'Olivine Lighthouse'],
  ['Moltres', ['moltres'], 'Victory Road'],
  ['Galarian Articuno, Zapdos, and Moltres', ['articuno-galar', 'zapdos-galar', 'moltres-galar'], 'Route 50 Battle Café'],
  ['Mewtwo', ['mewtwo'], 'Nameless Dungeon — Kitakami Border'],
  ['Mew', ['mew'], 'Faraway Island'],
  ['Raikou, Entei, and Suicune', ['raikou', 'entei', 'suicune'], 'Roaming Johto'],
  ['Lugia', ['lugia'], 'Whirl Islands'],
  ['Shadow Lugia', ['lugia-shadow'], 'Regular Lugia encounter'],
  ['Ho-Oh', ['ho-oh'], 'Bell Tower'],
  ['Celebi', ['celebi'], 'Ilex Forest shrine'],
  ['Regirock', ['regirock'], 'Vajra Desert West'],
  ['Regice', ['regice'], 'Snowtop Mountain'],
  ['Registeel', ['registeel'], 'Railway Cave'],
  ['Latias and Latios', ['latias', 'latios'], 'Vajra Desert East temple'],
  ['Kyogre', ['kyogre'], 'Dive spot south of Route 33'],
  ['Groudon', ['groudon'], 'Dive spot on Route 50'],
  ['Rayquaza', ['rayquaza'], 'Embedded Tower'],
  ['Jirachi', ['jirachi'], 'Mt. Silver rival story'],
  ['Uxie', ['uxie'], 'Route 30 Rock Climb spot'],
  ['Mesprit', ['mesprit'], 'Route 47 Rock Climb spot'],
  ['Azelf', ['azelf'], 'Mahogany Town Rock Climb spot'],
  ['Dialga, Palkia, and Giratina', ['dialga', 'palkia', 'giratina-altered'], 'Ruins of Alph secret room portals'],
  ['Primal Dialga', ['dialga-primal'], 'Spear Pillar Summit'],
  ['Heatran', ['heatran'], 'Mt. Mortar depths'],
  ['Regigigas', ['regigigas'], 'Mt. Silver back room'],
  ['Cresselia', ['cresselia'], 'Lake of Rage'],
  ['Phione', ['phione'], 'South Johto Sea'],
  ['Manaphy', ['manaphy'], 'Evolution'],
  ['Darkrai', ['darkrai'], 'Cherrygrove City inn'],
  ['Shaymin', ['shaymin-land'], 'Dream Garden — Tohjo Falls'],
  ['Arceus', ['arceus-normal'], 'Radio Tower 2F'],
  ['Victini', ['victini'], 'Kitakami Border house'],
  ['Cobalion', ['cobalion'], 'Railway Cave — Route 33 exit'],
  ['Terrakion', ['terrakion'], 'Dark Cave North'],
  ['Virizion', ['virizion'], 'Route 50'],
  ['Tornadus, Thundurus, Landorus, and Enamorus', ['tornadus-incarnate', 'thundurus-incarnate', 'landorus-incarnate', 'enamorus-incarnate'], 'Route 50 Battle Café'],
  ['Meloetta', ['meloetta-aria'], 'Ecruteak Dance Theater'],
  ['Genesect', ['genesect'], 'Abandoned Rocket Warehouse'],
  ['Eternal Floette', ['floette-eternal'], 'Trophy reward'],
  ['Diancie', ['diancie'], 'Route 50 Battle Café'],
  ['Hoopa', ['hoopa-confined'], 'Vajra Pyramid'],
  ['Magearna', ['magearna'], 'Goldenrod Apartment top floor'],
  ['Original Color Magearna', ['magearna-original'], 'Trophy reward'],
  ['Marshadow', ['marshadow'], 'Sprout Tower basement'],
  ['Tapus', ['tapu-koko', 'tapu-lele', 'tapu-bulu', 'tapu-fini'], 'Route 50 Battle Café'],
  ['Poipole', ['poipole'], 'Trophy reward'],
  ['Zeraora', ['zeraora'], 'Battle Tower exterior'],
  ['Meltan', ['meltan'], 'Rinto Village trade'],
  ['Kubfu', ['kubfu'], 'Blackthorn City Rock Climb cave'],
  ['Zarude', ['zarude'], 'Trophy reward'],
  ['Bloodmoon Ursaluna', ['ursaluna-bloodmoon'], 'Lost Woods'],
  ['Paradox Pokémon', ['great-tusk', 'scream-tail', 'brute-bonnet', 'flutter-mane', 'slither-wing', 'sandy-shocks', 'roaring-moon', 'iron-treads', 'iron-bundle', 'iron-hands', 'iron-jugulis', 'iron-moth', 'iron-thorns', 'iron-valiant'], 'South Johto — Meteor Island'],
  ['Chien-Pao', ['chien-pao'], 'Ice Path depths'],
  ['Chi-Yu', ['chi-yu'], 'Battle Café fountain'],
  ['Walking Wake, Gouging Fire, and Raging Bolt', ['walking-wake', 'gouging-fire', 'raging-bolt'], 'Past Paradox chamber'],
  ['Iron Leaves, Iron Boulder, and Iron Crown', ['iron-leaves', 'iron-boulder', 'iron-crown'], 'Future Paradox chamber'],
  ['Koraidon/Miraidon', ['koraidon', 'miraidon'], 'Route 50 Battle Café'],
  ['Fezandipiti', ['fezandipiti'], 'Kitakami'],
  ['Ogerpon', ['ogerpon-teal'], 'Kitakami Mountain']
];
const speciesBySlug = new Map(species.map(entry => [entry.slug, entry]));
const legendary = [];
const legendaryKeys = new Set();
for (const [heading, keys, location] of legendaryRules) {
  const method = legendarySections.get(heading);
  if (!method) continue;
  for (const key of keys) {
    const entry = speciesBySlug.get(key);
    if (!entry) continue;
    legendaryKeys.add(key);
    legendary.push({ name: friendlyKey(entry), category: 'Legendary guide', location, method, source: `Official v1.1.2 Legendary guide — ${heading}` });
  }
}
for (const record of structuredStaticEncounters) {
  if (legendaryKeys.has(record.entry.slug)) continue;
  acquisition.special.push({ ...record.base, method: 'One-time static encounter', details: 'The official species-details export marks this as a one-time encounter; it is not classified as a legendary unless the Legendary guide also lists it.' });
}

const eggs = oddEggPokemon.length ? [{
  id: 'odd-egg',
  title: 'Odd Egg',
  category: 'One-time Gift Egg',
  location: 'Goldenrod City',
  cost: 'One-time gift',
  unlock: 'Reach the documented Odd Egg gift in Goldenrod City',
  method: 'Each listed Pokémon has a 1/7 chance.',
  note: 'Pool and odds are taken from the v1.1.2 per-form location export.',
  pokemon: unique(oddEggPokemon)
}] : [];

const trainerSprite = value => copyAsset(value, 'assets/trainers/soulgold');
const trainerNameAliases = {
  // trainers.json uses this shorthand without a species constant; the exported
  // non-Zen Galarian form is the only matching standard battle form.
  'darmanitan-galar': 'Darmanitan Galar Standard'
};
const trainerMoveAliases = { 'hi-jump-kick': 'High Jump Kick' };
const battles = trainersRaw.map((trainer, index) => {
  const trainerText = `${trainer.constant} ${trainer.name} ${trainer.displayName} ${trainer.pic}`;
  const boss = /LEADER|ELITE|CHAMPION|RIVAL|SILVER|CRYSTAL|GIOVANNI|ADMIN|EXECUTIVE/i.test(trainerText);
  const rival = /RIVAL|SILVER|CRYSTAL/i.test(trainerText);
  const levels = trainer.party.map(member => Number(member.level)).filter(Number.isFinite);
  return {
    id: `${slug(trainer.constant)}-${slug(trainer.difficulty)}-${index + 1}`,
    trainer: trainer.displayName || trainer.name,
    location: trainer.locations?.[0] || 'Location not documented',
    category: 'Trainer Battle',
    mode: trainer.difficulty,
    boss,
    rival,
    doubleBattle: false,
    rematch: /REMATCH|REMATCHES|REPEAT|REBATTLE/i.test(trainer.constant),
    levelMin: levels.length ? Math.min(...levels) : null,
    levelMax: levels.length ? Math.max(...levels) : null,
    sprite: trainerSprite(trainer.sprite),
    team: trainer.party.map(member => {
      const memberSpecies = speciesByConstant.get(member.constant);
      return {
        name: memberSpecies ? friendlyKey(memberSpecies) : trainerNameAliases[slug(member.displayName || member.name)] || member.displayName || member.name,
        level: member.level,
        item: member.itemName || member.item || '',
        ability: member.ability || '',
        innates: (member.innates || []).map(constant => abilityByConstant.get(constant)?.name || title(constant)),
        nature: member.nature || '',
        evs: member.evs || {},
        ivs: member.ivs || {},
        moves: (member.moves || []).filter(move => move && move !== 'None').map(move => trainerMoveAliases[slug(move)] || move)
      };
    }),
    source: { file: 'official v1.1.2 trainers.json', row: index + 1 }
  };
});

const tutorMoveIds = unique(pokemon.flatMap(entry => entry.learnset.tutor)).sort((a, b) => a - b);
const dracoId = moveByConstant.get('MOVE_DRACO_METEOR')?.id;
const moveTutors = {
  meta: {
    label: 'DOCUMENTED MOVE ACQUISITION',
    description: 'Tutor compatibility is taken from the official per-form export. Locations and purchase rules follow the official FAQ and dedicated-tutor metadata.',
    limitations: ['A tutor entry documents compatibility and access; it does not imply that a Pokémon knows the move before tutoring. No baseline move definitions were needed.']
  },
  tutors: tutorMoveIds.map(id => {
    const move = moves.find(entry => entry.id === id);
    const dedicated = id === dracoId;
    return {
      id: `tutor-${move.key}`,
      moveId: id,
      move: move.name,
      location: dedicated ? "Dragon's Den Shrine" : 'Olivine City — top-right house',
      availability: dedicated ? "Exclusive to the Dragon's Den Shrine tutor" : 'Purchase infinite Move Tutor access for ₽44,444',
      notes: [dedicated ? common.dedicatedTutors.MOVE_DRACO_METEOR : 'Official FAQ service location and cost.']
    };
  }),
  services: [{
    id: 'egg-move-master',
    name: 'Egg Move Master',
    locations: ['Blackthorn City'],
    notes: 'Official FAQ: purchase infinite Egg Move Master access for ₽88,888.'
  }]
};

const baselineConfig = read(path.join(root, 'config', 'baseline-config.json'));
baselineConfig.includedPokemonKeys = supportedPokeapi.sort();
baselineConfig.supplementalMoveIds = [];
baselineConfig.fallbackMoveIds = [];
baselineConfig.fallbackItemIds = [];
baselineConfig.includeBaselineLearnsets = false;
baselineConfig.includeItems = false;
baselineConfig.downloadSprites = false;
baselineConfig.includeShinySprites = false;
write(path.join(root, 'config', 'baseline-config.json'), baselineConfig);

write(path.join(root, 'data', 'overrides', 'guide-data.json'), {
  meta: {
    version: '1.1.2',
    source: 'Frozen official SoulGold v1.1.2 generated documentation',
    membershipPolicy: 'Exactly the 959 records in species.json; baseline records outside this set are forbidden.',
    fallbackPolicy: 'Move and item fallback arrays are empty because the hack exports complete definitions for every imported reference.'
  },
  pokemon,
  moves,
  locations
});
write(path.join(root, 'data', 'overrides', 'abilities-data.json'), abilities);
write(path.join(root, 'data', 'overrides', 'items-data.json'), items);
write(path.join(root, 'data', 'overrides', 'move-tutor-data.json'), moveTutors);
write(path.join(root, 'data', 'acquisition-data.json'), acquisition);
write(path.join(root, 'data', 'legendary-data.json'), legendary);
write(path.join(root, 'data', 'egg-data.json'), eggs);
write(path.join(root, 'data', 'battle-data.json'), {
  meta: {
    version: '1.1.2',
    label: 'OFFICIAL TRAINER EXPORT',
    sources: { official: 'Frozen official SoulGold v1.1.2 trainers.json' },
    sourceNote: 'Normal and Hard records remain separate. Major/rival labels are derived only from source trainer identifiers and portraits.',
    teamDetailNote: 'Teams, levels, moves, abilities, innates, held items, natures, EVs and IVs reflect the official export.'
  },
  battles
});

const report = {
  importedAt: new Date().toISOString(),
  release: { version: '1.1.2', commit: 'f434c1658b2194a9f688f6765e6aca4c53b9e1c8' },
  membership: {
    sourceForms: species.length,
    pokedexGroups: new Set(species.map(entry => entry.dex)).size,
    pinnedBaselineForms: supportedPokeapi.length,
    hackOnlyOrUnresolvedPokeapiForms: customFormKeys.length,
    customFormKeys
  },
  counts: {
    pokemon: pokemon.length,
    moves: moves.length,
    abilities: abilities.length,
    items: items.length,
    encounterLocations: locations.length,
    trainers: battles.length,
    legendaryEntries: legendary.length,
    acquisitions: Object.fromEntries(Object.entries(acquisition).map(([key, entries]) => [key, entries.length])),
    tutorMoves: moveTutors.tutors.length
  },
  fallbackDefinitions: { moves: [], items: [] },
  unresolvedReferences: { moves: [...unresolvedMoves] },
  notes: [
    'Official hack exports override baseline definitions and establish availability.',
    'The baseline allowlist contains only exact source slugs also recognized by PokeAPI.',
    'Custom or PokeAPI-unresolved forms receive stable local IDs and never receive substituted base-form sprites.',
    'Journey requirements beyond the structured location label remain described by the frozen official guides and are not inferred.'
  ]
};
write(path.join(root, 'sources', 'import-report.json'), report);

if (unresolvedMoves.size) throw new Error(`Unresolved move constants: ${[...unresolvedMoves].join(', ')}`);
console.log(`Imported ${pokemon.length} hack forms, ${moves.length} moves, ${items.length} items, ${locations.length} encounter maps and ${battles.length} trainer records.`);
console.log(`Pinned baseline allowlist: ${supportedPokeapi.length}; hack-only/custom forms: ${customFormKeys.length}; move/item fallbacks: 0/0.`);
