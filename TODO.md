# TODO - Husky Setup for frontEnd/AEL

## Objectif

Configurer Husky avec un pre-commit hook pour formatter et analyser le code automatiquement à chaque commit.

## Étapes

- [x] 1. Installer Husky dans le projet principal
- [x] 2. Initialiser Husky dans le projet
- [x] 3. Configurer le pre-commit hook avec Prettier
- [ ] 4. Tester le hook avec un commit de test

## Détails de l'implémentation

### Fichiers créés/modifiés:

- `.husky/pre-commit` - Le hook qui exécute Prettier

### Ce que fait le hook:

- À chaque `git commit`, Husky exécute Prettier
- Prettier formate automatiquement tous les fichiers
- Les fichiers formatés sont ajoutés au commit

### Pour tester:

```bash
git add .
git commit -m "test husky"
```

Si le hook fonctionne, Prettier formatera vos fichiers automatiquement.
