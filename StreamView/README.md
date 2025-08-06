# StreamFlix - Plateforme de Streaming

Une plateforme de streaming moderne inspirée de Netflix, développée avec React, TypeScript et l'API TMDB.

## 🎬 Fonctionnalités

- **Interface Netflix-style** avec thème sombre optimisé
- **Intégration TMDB** pour des données de films authentiques
- **Pages complètes** : Accueil, Films, Séries, Genres, Historique, Ma Liste
- **Lecteur vidéo** avec support des bandes-annonces YouTube
- **Recherche en temps réel** avec filtres avancés
- **Navigation responsive** avec sidebar fixe
- **Gestion de liste personnelle** avec fonctionnalités de tri

## 🚀 Installation et Lancement

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Clé API TMDB (The Movie Database)

### Installation locale

1. **Cloner le projet**
```bash
git clone <repository-url>
cd streamflix
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
Créer un fichier `.env` à la racine du projet :
```env
DATABASE_URL=postgresql://user:password@localhost:5432/streamflix
TMDB_API_KEY=votre_cle_api_tmdb
```

4. **Obtenir une clé API TMDB**
- Créer un compte sur [themoviedb.org](https://www.themoviedb.org/)
- Aller dans Paramètres → API
- Copier votre clé API v3

5. **Configurer la base de données**
```bash
# Initialiser la base de données
npm run db:push
```

6. **Lancer en développement**
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5000`

7. **Build pour production**
```bash
npm run build
npm start
```

## 📁 Structure du Projet

```
streamflix/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages principales
│   │   ├── hooks/          # Hooks personnalisés
│   │   └── lib/            # Utilitaires et types
├── server/                 # Backend Express
│   ├── routes.ts           # Routes API
│   ├── tmdb-service.ts     # Service TMDB
│   └── db.ts               # Configuration base de données
├── shared/                 # Schémas partagés
└── package.json
```

## 🛠 Technologies Utilisées

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le styling
- **Wouter** pour le routage
- **TanStack Query** pour la gestion d'état
- **Radix UI** + **shadcn/ui** pour les composants

### Backend
- **Node.js** avec Express
- **PostgreSQL** avec Drizzle ORM
- **TMDB API** pour les données de films
- **Neon Database** (production)

### Outils de développement
- **Vite** pour le build et dev server
- **TypeScript** pour la sécurité des types
- **ESBuild** pour la compilation rapide

## 🎯 Pages Principales

- **/** - Page d'accueil avec films populaires et carrousels
- **/movies** - Catalogue complet avec recherche et filtres
- **/movies/:id** - Page détaillée avec bandes-annonces
- **/series** - Collection de séries TV
- **/genres** - Navigation par catégories
- **/watchlist** - Liste personnelle de films
- **/history** - Historique de visionnage

## 🔧 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build production
npm start            # Serveur production
npm run db:push      # Synchronisation base de données
```

## 🌟 Fonctionnalités Avancées

- **Recherche intelligente** avec suggestions
- **Carrousels interactifs** avec navigation tactile
- **Player vidéo** intégré avec contrôles personnalisés
- **Système de favoris** avec persistance
- **Interface responsive** mobile et desktop
- **Thème sombre** optimisé pour le streaming

## 📱 Responsive Design

L'application est entièrement responsive avec :
- **Mobile First** approach
- **Breakpoints Tailwind** : sm, md, lg, xl
- **Navigation adaptative** avec sidebar collapsible
- **Grilles flexibles** pour tous les écrans

## 🔐 Sécurité et Performance

- **Validation des données** avec Zod
- **Cache intelligent** avec TanStack Query
- **Lazy loading** des images
- **Optimisation des requêtes** API TMDB
- **Variables d'environnement** sécurisées

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation TMDB API
- Vérifier les logs du serveur pour le debugging

---

**StreamFlix** - Votre plateforme de streaming nouvelle génération 🎭