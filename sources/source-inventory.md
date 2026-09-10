# Source inventory

| Category | File or URL | Version/date | Authority | Imported | Notes |
|---|---|---|---|---|---|
| Mainline structured baseline | https://github.com/PokeAPI/api-data | Pinned in `baseline.lock.json` | Generic fallback | Generated | Never overrides current hack documentation. |
| Mainline sprite baseline | https://github.com/PokeAPI/sprites | Pinned in `baseline.lock.json` | Generic fallback | Generated | Replace missing/custom form assets deliberately. |
| Release/download index | https://www.hackdex.app/hack/soulgold | Target v1.1.2; checked 2026-09-09 | Maintainer-linked release hub | No | Site returned HTTP 403 to automated intake; official FAQ names it as the latest-version source. |
| Source repository and version evidence | https://github.com/Eemeliri/soulgold | Tag `v1.1.2`, commit `f434c1658b2194a9f688f6765e6aca4c53b9e1c8`, 2026-09-08 | Official maintainer repository | Yes | Frozen locally under `sources/reference/soulgold-v1.1.2`. `include/config/version.h` still says `v1.1.1`; the tag remains authoritative. |
| Pokédex, forms and stats | https://eemeliri.github.io/soulgold/pokedex/ | v1.1.2 tag snapshot | Official generated documentation | Yes | 959 exact forms across 702 groups imported; final membership exactly matches the export. |
| Abilities | https://eemeliri.github.io/soulgold/abilities/ | v1.1.2 tag snapshot | Official generated documentation | Yes | 524 hack definitions plus per-form regular, hidden and innate assignments imported. |
| Evolutions | https://eemeliri.github.io/soulgold/pokedex/ | v1.1.2 tag snapshot | Official generated documentation | Yes | Per-form edges, methods and targets imported and reference-validated. |
| Moves and learnsets | https://eemeliri.github.io/soulgold/moves/ | v1.1.2 tag snapshot | Official generated documentation | Yes | 935 complete hack definitions and all per-form learnsets imported; zero baseline fallbacks required. |
| Move tutors and services | https://eemeliri.github.io/soulgold/machines/ | v1.1.2 tag snapshot | Official generated documentation | Yes | 143 compatible tutor moves plus FAQ-backed services/locations imported. |
| Wild encounters | https://eemeliri.github.io/soulgold/encounters/ | v1.1.2 tag snapshot | Official generated documentation | Yes | 133 map records imported with day/night, method, rod, level and rate preserved. |
| Other acquisition methods | https://eemeliri.github.io/soulgold/guides/faq/ | v1.1.2 tag snapshot | Official generated guide hub | Yes | Gifts, purchases, trades, fossils, eggs, form services and other structured acquisition entries imported. |
| Legendary acquisition | https://eemeliri.github.io/soulgold/guides/legendaries/ | v1.1.2 tag snapshot | Official generated guide | Yes | 91 confirmed entries imported with their exact guide requirements, including puzzle and progression text. |
| Hidden Grotto acquisition | https://eemeliri.github.io/soulgold/guides/hidden-grottos/ | v1.1.2 tag snapshot | Official generated guide | Yes | Ten Grottos and 40 Pokémon entries imported with conditional odds and guarantees labelled. |
| Items and shops | https://eemeliri.github.io/soulgold/items/ | v1.1.2 tag snapshot | Official generated documentation | Yes | 216 located items plus 25 trainer-only held-item definitions imported; zero baseline fallbacks required. |
| Trainer battles | https://eemeliri.github.io/soulgold/trainers/ | v1.1.2 tag snapshot | Official generated documentation | Yes | 433 Normal/Hard records imported with parties, levels, moves, abilities/innates, held items, natures, EVs and IVs. |
| Trainer profile, starter and rival rules | https://github.com/Eemeliri/soulgold | v1.1.2 tag snapshot | Official source repository | Yes | `src/ui_birch_case.c` confirms Chespin, Fennekin, Froakie, Chikorita, Cyndaquil, Totodile, Sprigatito, Torchic and Popplio. Exported trainer IDs confirm the Chikorita/Cyndaquil/Totodile Silver variants; Gold and Crystal counterpart battles remain independent. |
| FAQ and known issues | https://eemeliri.github.io/soulgold/guides/faq/ | v1.1.2 tag snapshot | Official generated documentation | No | Version checks, supported-emulator guidance and selected progression answers; not yet a complete issue inventory. |
| Badges | https://github.com/Eemeliri/soulgold | v1.1.2 tag snapshot | Official source repository | Yes | `src/achievements.c` confirms the eight Johto names, leaders and flag order; `graphics/trainer_card/badges.png` supplies the coloured icons. |
| Maps | https://github.com/Eemeliri/soulgold | v1.1.2 tag snapshot | Official source repository | Yes | Official `map_full.png` imported as the world-map overview; unprovided location-marker coordinates remain intentionally absent. |
| Sprites and artwork | https://github.com/Eemeliri/soulgold | v1.1.2 tag snapshot | Official source repository with credited contributors | Yes | 1,918 exact normal/shiny form sprites plus item/trainer assets imported locally. |
| Supplied visual identity | `assets/art/soulgold-logo.png` | Supplied 2026-09-09 | User-supplied image | Yes | Retained as a palette reference but no longer displayed as the guide's primary image or navigation mark. Rights/attribution remain unverified for public release. |
| Box artwork reference | https://pokemonsoulgold.com/box-art/ | Updated 2026-08-17; checked 2026-09-09 | SoulGold project site | Reference only | Johto, paired legends and gold identity reference. Featured cover credits developer @rahtak and illustrator @Mangacca. No artwork was copied into generated assets. |
| Generated hero artwork | `assets/art/soulgold-hero-v2.png` | Generated 2026-09-09 | Original project asset | Yes | Panoramic Johto-inspired sunrise with red/gold and navy/silver sky guardians, generated from the supplied title-screen palette; no embedded text or copied box artwork. |
| Generated app-icon master | `assets/art/soulgold-icon-master.png` | Generated 2026-09-09 | Original project asset | Yes | Source for favicons, Apple touch icon, 192px/512px PWA icons and maskable icon. |

Record conflicts and confidence notes here. For every hack source, note which baseline fields it verifies or overrides. Prefer official hack documentation, then maintained community references, then clearly-labelled inference. An inherited baseline value is not automatically verified.

## Intake decisions and conflicts

- The official `v1.1.2` tag is the frozen authority for this guide. Do not silently import later `master` changes.
- The tag points to commit `f434c1658b2194a9f688f6765e6aca4c53b9e1c8` dated 2026-09-08; the checked-in display constant still says `v1.1.1`.
- Pokémon/form membership comes only from the official species export. The National Dex ceiling controls baseline fetching, not membership.
- Any move or item definition borrowed from the pinned mainline baseline must retain fallback provenance and cannot establish availability or hack-specific behaviour.
