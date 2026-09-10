# Guide setup status

- Status: Deployed
- Current phase: GitHub Pages and encrypted Cloudflare sync live
- Readiness: Advanced ready for supplied evidence; Journey coverage partial
- Last updated: 2026-09-10
- Next question: Review the live guide and choose any post-release refinements.

## Progress

| Area | Status | Notes |
|---|---|---|
| Identity | Complete | Pokémon SoulGold 1.1.2; Johto; Pokémon Emerald (GBA; pokeemerald-expansion) |
| Baseline profile | Complete | Scarlet/Violet mechanics fallback; National Dex 1025; pinned local baseline and sprites |
| Feature scope | Complete | Hack-only Core, Planning, Journey and evidence-backed Advanced coverage; unsupported features remain disabled |
| Source inventory | Complete | Official v1.1.2 repository/documentation, supplied branding reference and box-art page inventoried |
| Core data | Complete | 959 documented Pokémon/form records across 702 Pokédex groups; structured encounters and acquisitions |
| Planning data | Complete | 935 hack moves, per-form learnsets, TM/HM compatibility, 143 tutors and 241 hack items |
| Journey data | Partial | Complete 121-trophy checklist and six reward milestones added alongside Legendary, Hidden Grotto, FAQ, gift/trade/fossil/egg evidence; complete route/quest order unavailable |
| Advanced data | Covered where evidenced | 433 trainer records, eight Johto badges, world map, and source-backed trainer/starter/rival profile included; unaudited map markers intentionally omitted |
| Local build | Complete | Data build, validation, provenance and asset audits passed; desktop and touch/mobile layouts reviewed |
| Deployment | Complete | Public GitHub repository, GitHub Pages site and encrypted Cloudflare sync worker are live and verified |

## Confirmed decisions

- Identity: Pokémon SoulGold, version 1.1.2, region Johto, base ROM/platform Pokémon Emerald (GBA; pokeemerald-expansion).
- Baseline: Scarlet/Violet, National Dex 1025, local normal/shiny sprites enabled.
- Save namespace: `pokemon-soulgold-field-guide`.
- Pokémon scope is strictly hack-only: the official v1.1.2 species/form export is the membership allowlist. Generic baseline membership is forbidden.
- Baseline moves/items may define only hack-referenced records that lack a complete hack definition, and every such use must be labelled as fallback provenance without implying availability. This build uses zero move and zero item fallbacks.
- The official `v1.1.2` tag is authoritative. Its checked-in `include/config/version.h` still displays `v1.1.1`; retain this as a documented source inconsistency.

## Source coverage

| Category | Coverage | Best source | Remaining gap |
|---|---|---|---|
| Pokédex, forms, stats, abilities and evolutions | Complete | Official v1.1.2 `docs/data/species*.json`, Pokédex and abilities docs | None identified in supplied evidence |
| Official repository, wiki, changelog and version evidence | Complete | Official repository tag `v1.1.2` at `f434c1658b2194a9f688f6765e6aca4c53b9e1c8` | Internal display string says v1.1.1 |
| Moves and learnsets | Complete | Official `moves.json` and per-form species details | Zero fallback definitions required |
| Move tutors and services | Covered | Official machines data, per-form TM/HM and tutor arrays | Broader narrative service guidance remains optional |
| Wild encounters and other acquisition | Complete | Official encounters, species locations, gifts/trades/fossils/eggs, legendary and Hidden Grotto guides | Conditional distinctions preserved |
| Items and shops | Complete | Official item and machine exports with acquisition source/location | Zero fallback definitions required |
| Trainer and boss battles | Covered | Official v1.1.2 trainer export | Narrative rematch/profile interpretation remains optional |
| Progression gates, route/quest order and level caps | Partial | Legendary, FAQ, gift/trade, trophy and Grotto guides | No complete route/story/quest ordering source identified |

## Activity log

- Frozen the official v1.1.2 tag at commit `f434c1658b2194a9f688f6765e6aca4c53b9e1c8`; pinned the reusable baseline and sprite inputs.
- Imported 959 exact forms, 935 moves, 524 abilities, 241 items, 133 encounter maps, 433 trainer records, 143 tutors and the documented special-acquisition guides.
- Verified zero move-definition fallbacks and zero item-definition fallbacks.
- Passed the data build, schema/reference validation, provenance audit and local asset audit; 2,170 local assets were verified, including 1,918 Pokémon sprite files.
- Reviewed desktop and touch/mobile layouts. Included the source world map but intentionally omitted unaudited marker coordinates.
- Enabled the Overview Gym Challenge tracker with all eight source-confirmed Johto badges and the official coloured trainer-card icons.
- Added the first-load trainer setup with Gold/Crystal sprites, all nine source-confirmed player starters, automatic caught/team updates, and Silver battle filtering by the chosen rival starter. Skipping keeps the default Rival label and all three team variants.
- Moved the persistent trainer/rival editor into Progress so the character, both names and both starter choices can be changed at any time; legacy `#trainer` links continue to open Progress.
- Added an optional first-start starter nickname that is carried into Team Builder, aligned the profile dropdown row, and corrected shared Pokémon labels to use source display names in current/future builders and global search.
- Imported all 121 active trophies from the pinned v1.1.2 source, added a searchable tiered checklist and six Route 40 reward milestones, and connected collected Pokémon rewards to exact-form Pokédex caught state and save/sync data.
- Aligned the Trophies search and tier controls with matching visible labels across desktop and mobile layouts.
- Added an explicit Galarian Form label for Zigzagoon so its exact form can be distinguished, selected and saved in Team Builder and Future Team.
- Replaced the original compact title-screen-derived hero treatment with a new panoramic Johto sunrise illustration; retained the first generated hero as an unreferenced local backup.
- Added an offline application shell and isolated local review on port 8893 to avoid stale service-worker state from prior guides.
- Save migration, recovery and destructive import paths remain outside the claimed release QA scope.
- Deployed `pokemon-soulgold-field-guide-sync` to the existing Cloudflare account with its own `pokemon-soulgold-field-guide-sync-saves` KV namespace and restricted CORS origins for the GitHub Pages owner origin plus local port 8893.
- Published the public `jimineybillybob1/pokemon-soulgold-field-guide` repository and verified the GitHub Pages site returns the expected Pokémon SoulGold title. Verified the Cloudflare health endpoint returns sync version 2 and permits the GitHub Pages origin.
