# Architecture Login → App.html

```
┌─────────────────────────────────────────────────────────────────┐
│                        index.html                                │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     src/main.ts                                  │
│              (Point d'entrée Angular)                            │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      app.ts (App Component)                      │
├─────────────────────────────────────────────────────────────────┤
│  Imports:                                                        │
│  - RouterOutlet                                                  │
│  - Entete (Header)                                               │
│  - Contenu (Container principal)                                 │
│                                                                  │
│  Template: app.html                                              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      app.html (Template)                         │
├─────────────────────────────────────────────────────────────────┤
│  <header>                                                        │
│    <app-entete>                                                  │
│      "Agence en ligne"                                           │
│    </app-entete>                                                 │
│  </header>                                                       │
│                                                                  │
│  <main>                                                          │
│    <app-contenu>  ◄── Conteneur principal des pages             │
│      <router-outlet>                                            │
│    </app-contenu>                                                │
│  </main>                                                         │
│                                                                  │
│  <footer>                                                        │
│    <app-entete></app-entete>                                     │
│  </footer>                                                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    app.routes.ts                                  │
├─────────────────────────────────────────────────────────────────┤
│  Routes:                                                         │
│  {                                                               │
│    path: '',                                                     │
│    component: Contenu,                                          │
│    loadChildren: () => import('./AEL.routes')                   │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AEL.routes.ts                                  │
├─────────────────────────────────────────────────────────────────┤
│  Routes:                                                         │
│  { path: '', component: Connexion }         ◄── Page Login      │
│  { path: 'inscription', component: Inscription }                │
│  { path: '**', redirectTo: '' }                                 │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   contenu.ts                                      │
├─────────────────────────────────────────────────────────────────┤
│  <router-outlet></router-outlet>  ◄── Affiche la page active    │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   connexion.ts                                   │
├─────────────────────────────────────────────────────────────────┤
│  Selector: app-connexion                                        │
│  Imports: Login                                                  │
│  Template: <app-login></app-login>                              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      login.ts                                    │
├─────────────────────────────────────────────────────────────────┤
│  Selector: app-login                                            │
│  Formulaire Reactive:                                           │
│  - email (FormControl)                                          │
│  - password (FormControl)                                       │
│  - rememberMe (FormControl)                                     │
│                                                                  │
│  Méthode: connexion()  ◄── À implémenter                        │
│                                                                  │
│  Imports:                                                        │
│  - ReactiveFormsModule                                          │
│  - MatSnackBarModule                                            │
│  - MatFormFieldModule                                           │
│  - MatInputModule                                               │
│  - MatButtonModule                                              │
│  - MatCheckboxModule                                            │
│  - MatCardModule                                                │
└─────────────────────────────────────────────────────────────────┘
```

## Flux de Données

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   index.html │───►│   main.ts    │───►│    app.ts    │───►│   app.html   │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                                                  │
                                                                  ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    API       │◄───│   Login      │◄───│ Connexion    │◄───│ contenu.ts   │
│  Backend     │    │   (TS)       │    │   (TS)       │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

## Structure des Fichiers

```
frontEnd/AEL/src/
├── index.html
├── main.ts
└── app/
    ├── app.ts              ← Component racine
    ├── app.html            ← Template principal
    ├── app.css
    ├── app.routes.ts       ← Routing principal
    ├── AEL.routes.ts       ← Routes applicatives
    ├── features/
    │   ├── entete/
    │   │   └── entete.ts   ← Header "Agence en ligne"
    │   ├── login/
    │   │   └── login.ts    ← Formulaire de login
    │   └── contenu/
    │       └── contenu.ts  ← Conteneur avec router-outlet
    └── pages/
        └── connexion/
            └── connexion.ts ← Page connexion
```

## État Actuel

| Composant     | État | Description                                  |
| ------------- | ---- | -------------------------------------------- |
| app.ts        | ✅   | Structure de base                            |
| app.html      | ✅   | Template avec header/main/footer             |
| app.routes.ts | ✅   | Routing configuré                            |
| AEL.routes.ts | ✅   | Routes login/inscription                     |
| contenu.ts    | ✅   | Router outlet                                |
| connexion.ts  | ✅   | Wrapper pour Login                           |
| login.ts      | ⚠️   | Formulaire présent, méthode connexion() vide |
| entete.ts     | ✅   | Header样式 complet                           |
