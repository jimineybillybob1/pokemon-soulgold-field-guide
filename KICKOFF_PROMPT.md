# Reusable kickoff prompt

```text
Use $rom-hack-guide-builder and start guided setup for the game in this project.

Ask one or two questions at a time, persist progress in SETUP_STATUS.md, and inspect documentation in sources/inbox/ or supplied URLs before asking me to describe it. Build from the pinned PokeAPI-derived baseline, then layer hack-specific documentation over it.

Run the source-intake wizard before implementation. It should systematically ask for or locate the official project/repository, version notes, Pokédex and mechanics data, encounters and other acquisition, moves/tutors, items, battles, route/progression evidence, maps, SteamGridDB or official artwork links, an iOS/PWA icon plan, and optional release details. Mark each category as covered, partial, missing or not applicable; do not block a useful core guide on optional material.

Requirements:
1. Audit all hack sources and report missing data categories before implementation.
2. Confirm the closest mainline mechanics version group and maximum National Dex before fetching the baseline.
3. Import hack changes, additions and documented removals into data/overrides/; never edit generated baseline data by hand.
4. Preserve distinct forms, exact sprite identity, day/night encounters and acquisition methods.
5. Put exceptional rules in config/game-overrides.js.
6. Build the merged data and report sensitive fields still inherited from the baseline.
7. Run all data, provenance and asset validators.
8. Launch locally for review.
9. Do not create or deploy a GitHub repository until I explicitly approve it.
```
