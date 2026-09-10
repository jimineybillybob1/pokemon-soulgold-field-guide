# Game brief

Complete this file before asking Codex to import the guide.

## Identity

- Game name: Pokémon SoulGold
- Version: 1.1.2
- Region: Johto
- Repository slug: pokemon-soulgold
- Storage namespace: pokemon-soulgold-field-guide
- Difficulty modes: Version-matched modes/options to audit from source
- Platform/base ROM: Pokémon Emerald (GBA; pokeemerald-expansion)

## Baseline profile

- Closest mainline mechanics version group (for example `ultra-sun-ultra-moon` or `scarlet-violet`): scarlet-violet
- Maximum National Dex number, or all: 1025
- Include non-default forms (`yes`/`no`): yes
- Use PokeAPI-derived defaults where the hack has no documented override (`yes`/`no`): yes
- Download normal sprites locally (`yes`/`no`): yes
- Download shiny sprites locally (`yes`/`no`): yes
- Known generations or mechanics mixed into the hack: Emerald/pokeemerald-expansion platform with Generation 9 defaults, modern physical/special split, species through Gen 9, regional and special forms, Dynamax/Gigantamax data, Terastal-related forms/data, and extensive official plus custom Mega Evolutions. The guide baseline is definitional only and must not grant availability.

## Desired features

Mark each as `required`, `later`, or `disabled`.

- Pokédex and caught tracking: required
- Forms and shiny sprites: required
- Wild encounters with day/night: required
- Surfing and fishing: required
- Gifts, trades and purchases: required
- Eggs: required
- Raids: disabled
- Legendaries: required
- Items: required
- Moves and learnsets: required
- Move categories and tutors: required
- Team Builder: required
- Future Team and Favorites: required
- Saved complete teams and suggested teams: required
- Trainer battle guide: required
- Battle Planner: required
- Trainer profile/card, starter and rival mapping: required and locally implemented from frozen v1.1.2 source data
- Badges and progress: required
- Player journey and `available now` view: required where a documented gate exists; never infer availability across an undocumented gate
- Route/quest checklist and personal notes: required for documented route/quest material
- Decision filters and side-by-side comparison: required
- Challenge-rule profiles (Nuzlocke, monotype, level caps or other): later
- Shareable plan/progress snapshots: required
- Data coverage and guide-change view: required
- Experience design and visual direction: required
- Quality-of-life/navigation upgrades: required
- Motion and feedback: required, with reduced-motion support
- Accessibility and display preferences: required
- Region maps: required using version-matched source assets and audited markers
- Cloud save and sync: required; encrypted Cloudflare Worker/KV sync

## Special mechanics

Document unusual evolution rules, reversible forms, form-specific move retention, regional forms, custom types, custom Pokémon, altered type matchups, level caps, battle modes, or unavailable species.

- Membership source: exactly the 959 records in the official v1.1.2 species/form export (702 shared Pokédex groups); no species/form may enter the guide merely because it exists in PokeAPI or falls under National Dex 1025.
- Fallback policy: baseline move/item definitions are permitted only for records explicitly referenced by hack sources and must remain visibly labelled as fallback definitions. They must not imply hack availability, learnability, shop placement or game-specific effects.
- Hidden Grottos refresh daily. A Grotto roll is 60% Pokémon, 32% generic item and 8% location-specific item; the four listed Pokémon are equally likely conditional on the Pokémon result and have two guaranteed perfect IVs plus their Hidden Ability.
- Legendary and mythical acquisition includes story/badge gates, puzzles, trades, trophy milestones, Battle Café purchases and postgame quest chains; model these as acquisition requirements, not wild encounters.
- Official release authority is Git tag `v1.1.2`; `include/config/version.h` still reports `v1.1.1` and must be recorded as an upstream inconsistency.

## Display and hierarchy

- Encounter method order: Wild, Rock, Surf, Fish; only methods present in the v1.1.2 export are enabled.
- Fishing rod order and whether rod names are mandatory: Old Rod, Good Rod, Super Rod; rods are mandatory for every fishing entry.
- Location/battle subarea columns and inheritance rules: Encounter maps and trainer locations retain their exact exported labels. No undocumented subarea inheritance is introduced.
- In-game Pokédex numbering or separately numbered forms: 702 continuous Pokédex groups; all 959 forms have unique IDs and share their species group's `dexId`.
- Entries documented as unavailable/hidden: None are silently hidden. Source-confirmed membership is the complete 959-form export; availability gaps remain explicit.

## Player journey design

- Intended player decisions the guide should answer: What forms exist, where and how each can be obtained, what it learns, how it evolves, how to prepare for a documented trainer, and what remains uncaught.
- Progression gate and its reliable source: Official v1.1.2 Legendary, gift, trophy, Hidden Grotto and FAQ guides; gates are shown only where those sources state them.
- Route/story ordering source: No complete route/story order was supplied. Numerical routes sort naturally; other location order is presentation-only and does not assert progression.
- Rule variants that must remain separate from normal guide data: Normal and Hard trainer records; day/night encounters; fishing rods; conditional Grotto rolls; postgame and badge/story legendary gates.
- First-load profile behaviour: choose Gold or Crystal, a player name, one of the nine source-confirmed starters, an optional starter nickname, a rival name, and the rival's Johto starter. The player starter is marked caught and placed in the first empty Team Builder slot with that nickname. The rival choice filters only Silver's three-way team variants; skipping preserves all variants and the default `Rival` name. All profile fields except the one-time starter nickname remain editable from Progress; later nickname edits belong in Team Builder.
- Plan/progress fields safe to include in an export or shareable snapshot: Caught groups/forms, current/future teams, saved builds, display preferences, badges and local notes. Cloud sync uses the guide's encrypted client-side save envelope; the worker stores ciphertext only.

## Branding

- Navigation/hero mark: `assets/art/pwa-icon-512.png`, the generated paired sun-and-wave emblem. The supplied title-screen image remains a palette reference only. Rights/attribution should be reviewed before public release.
- Hero/background artwork: `assets/art/soulgold-hero-v2.png`, an original generated panoramic Johto sunrise using the supplied graphic as a palette reference; no remote box artwork was copied.
- Browser/app icon: `assets/art/soulgold-icon-master.png`, an original generated paired sun/ocean emblem with no text or recognizable character depiction.
- SteamGridDB game or artwork URLs and uploader credits: No SteamGridDB page exists as of intake. Alternative SoulGold box-art page: https://pokemonsoulgold.com/box-art/; featured cover credits developer @rahtak and illustrator @Mangacca.
- Preferred artwork use (logo, hero, social preview, icon source): Generated paired emblem for navigation and the compact hero mark; generated panorama for the main hero and social preview; supplied title-screen image retained only as a palette reference.
- Icon source image and crop direction: Square generated master; centered emblem. Maskable version uses a 78% safe-area scale on deep navy.
- Local favicon, `apple-touch-icon`, iPhone/iPad and 192px/512px PWA icon status: 32px/48px favicons, 180px Apple touch icon, 192px/512px PWA icons and a 512px maskable icon generated locally.
- Primary colour: Crimson `#c81d25`.
- Accent colour: Gold `#ffd84d`; supporting navy `#071b55`, sky blue and pale ice blue.
- Menu sprite preferences:
- Standalone-app title and status-bar style:
- Complete PNG icon set supplied/generated: Yes; deterministic derivatives are built by `scripts/build-brand-icons.py`.

## Guide experience design

- Intended feel and visual references (links/images/other guides): Modern companion with authentic Johto/GBA pixel-art character; supplied SoulGold logo plus paired crimson/gold and navy/ice visual motifs.
- Information density preference (compact, balanced or spacious): Balanced by default, with compact presentation for tables and encounter lists where it improves scanning.
- Most frequent player actions to optimise: Pokémon lookup, exact acquisition route, move/evolution inspection, caught tracking, team planning and returning to the prior context.
- Mobile/touch requirements and one-handed-use needs: Fast one-handed lookup, large touch targets, safe-area support, responsive dialogs and no hover-only actions.
- Keyboard, screen-reader, contrast or text-size requirements: Keyboard-first global search, visible focus, semantic controls, high contrast and resilient text scaling.
- Light/dark/system preference and persistence: Light, dark and system-aware presentation with persistent choice.
- Animations that clarify state or navigation; reduced-motion behaviour: Restrained orientation/confirmation motion only; honour reduced-motion and remove non-essential transitions.
- Persistent personal preferences (filters, sort, view mode, collapsed sections): Persist filters, sort, display mode and useful collapsed-section state per guide namespace.

## Deployment

- GitHub owner: jimineybillybob1
- Repository name: pokemon-soulgold-field-guide
- GitHub Pages URL: https://jimineybillybob1.github.io/pokemon-soulgold-field-guide/
- Cloud sync endpoint: https://pokemon-soulgold-field-guide-sync.james-stewart1992.workers.dev
