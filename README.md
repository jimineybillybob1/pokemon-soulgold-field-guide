# Pokémon SoulGold v1.1.2 Field Guide

A local-first field guide for Pokémon SoulGold v1.1.2, built from a pinned mainline definition baseline and a frozen official hack-specific data layer.

## Included data

- 959 source-confirmed Pokémon forms across 702 Pokédex groups
- 935 hack-defined moves, 524 hack-defined abilities and 241 hack-defined items
- 133 encounter maps, special acquisitions, legendaries and Hidden Grottos
- 433 Normal/Hard trainer records and 143 tutor/service entries
- 1,918 local normal/shiny Pokémon sprites

No baseline Pokémon are admitted into the guide unless the v1.1.2 hack sources confirm them. This build needs zero baseline move-definition fallbacks and zero baseline item-definition fallbacks. See [sources/release-scope.md](sources/release-scope.md) for the verified coverage and intentional omissions.

## Run locally

```powershell
npm run serve
```

Open `http://127.0.0.1:8893/`. The local application shell is cached for offline revisits after the first successful load.

## Rebuild and verify

```powershell
npm run import:soulgold
npm run build:data
npm run validate
npm run audit:assets
```

The source importer writes only to `data/overrides/`. Do not manually edit `data/baseline/` or the generated final data wrappers. The exact source freeze and baseline pins are recorded in `sources/source-inventory.md` and `baseline.lock.json`.

GitHub repository creation, remote push, cloud sync and deployment remain deliberately deferred.
