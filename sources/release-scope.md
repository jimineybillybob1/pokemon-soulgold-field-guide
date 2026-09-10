# Pokémon SoulGold v1.1.2 field-guide scope

This record defines what the local guide can claim from the frozen source set. It is a data-scope statement, not a deployment approval.

## Verified coverage

- 959 exact Pokémon/form records grouped into 702 Pokédex species families.
- 935 hack-defined moves, 524 hack-defined abilities and 241 hack-defined items.
- 133 encounter maps with day/night and conditional encounter distinctions preserved.
- 433 trainer records: 350 Normal-mode teams and 83 Hard-mode teams.
- 143 tutor/service entries, 91 legendary-guide entries, and structured gift, trade, fossil and egg acquisitions.
- 10 Hidden Grotto locations containing 40 documented Pokémon entries.
- All eight Johto badges in source flag order, with the official coloured trainer-card icons.
- A local first-load trainer profile using source character sprites, all nine confirmed player starters, and the three documented Silver team branches.
- 1,918 exact normal/shiny source sprites, audited locally for the confirmed form allowlist.

All Pokémon membership comes from the official v1.1.2 export. A baseline record is not evidence that a Pokémon or form exists in this hack.

## Definition fallbacks

The current import requires **zero move-definition fallbacks and zero item-definition fallbacks**. Every included move and item definition is supplied by the hack's version-matched data.

The fallback mechanism remains available for future incomplete source sets. If used, it must be labelled as a definition-only baseline fallback and must never imply that a move or item is obtainable in the hack.

## Intentional omissions and partial coverage

- No complete source-backed route, story or quest order has been identified; the guide does not invent one.
- World-map marker coordinates are omitted because the supplied sources do not provide an audited mapping from guide locations to exact image coordinates.
- Challenge-rule profiles beyond the documented Normal and Hard trainer modes remain deferred pending version-matched evidence.
- Comprehensive cheats and known-issues coverage has not been identified for this exact release.
- Raids and cloud sync are disabled because they are outside the documented local guide scope.
- Public artwork rights and attribution require review before any public release.
- Save migration, recovery and destructive import paths are not claimed as release-tested by this local data review.

## Source freeze and version note

The authoritative source snapshot is the official `v1.1.2` tag at commit `f434c1658b2194a9f688f6765e6aca4c53b9e1c8`. The checked-in `include/config/version.h` displays `v1.1.1`; this is retained as a documented inconsistency rather than silently rewritten.

## Release boundary

The guide is complete for the version-matched, hack-only evidence listed above and is suitable for local review. It is not yet declared public-release ready: Journey coverage is partial, the deferred evidence gaps remain visible, and no GitHub repository, remote push, cloud sync or deployment has been created.
