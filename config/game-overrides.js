window.GUIDE_OVERRIDES = {
  spriteFallbacks: {},
  formSpriteFallbacks: {},
  hiddenPokemonKeys: [],
  pokemonAliases: {},
  // Official trainers.json shorthand; resolves to the exported non-Zen form.
  battleSpeciesAliases: { darmanitangalar: 'Darmanitan Galar Standard' },
  displayNames: {},
  formLabels: {},
  sharedLearnsets: [],
  // v1.1.2 docs/data/encounters.json and the docs renderer's fishing slices.
  encounterMethodOrder: ['Wild', 'Rock', 'Surf', 'Fish'],
  fishingRodOrder: ['Old Rod', 'Good Rod', 'Super Rod'],
  requireFishingRod: true,
  // Frozen v1.1.2 src/ui_birch_case.c (sStarterChoices).
  starterChoices: ['Chespin', 'Fennekin', 'Froakie', 'Chikorita', 'Cyndaquil', 'Totodile', 'Sprigatito', 'Torchic', 'Popplio'],
  // Frozen v1.1.2 trainer export IDs use these three keys for Silver's team variants.
  rivalStarterChoices: ['Chikorita', 'Cyndaquil', 'Totodile'],
  profileDefaults: {
    name: 'Trainer',
    gender: 'male',
    costume: 'gold',
    starter: '',
    rivalName: 'Rival',
    rivalStarter: ''
  },
  trainerCostumes: [
    { id: 'gold', name: 'Gold', gender: 'male', sprite: 'assets/trainers/soulgold/brendan.png' },
    { id: 'crystal', name: 'Crystal', gender: 'female', sprite: 'assets/trainers/soulgold/may.png' }
  ],
  rivalStarterCounters: {},
  acquisitionNotes: {},
  mapPositions: {}
};
