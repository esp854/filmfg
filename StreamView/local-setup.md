# Configuration Locale - StreamFlix

## Installation rapide

### 1. Prérequis
```bash
# Vérifier Node.js
node --version  # Doit être 18+
npm --version
```

### 2. Installation des dépendances
```bash
npm install
```

### 3. Configuration des variables d'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos valeurs
nano .env
```

### 4. Clé API TMDB
1. Aller sur [themoviedb.org](https://www.themoviedb.org/)
2. Créer un compte gratuit
3. Aller dans Paramètres → API
4. Copier votre clé API v3
5. L'ajouter dans le fichier `.env` :
```env
TMDB_API_KEY=votre_cle_ici
```

### 5. Base de données locale (PostgreSQL)

#### Option A: Docker (Recommandé)
```bash
# Lancer PostgreSQL avec Docker
docker-compose up -d postgres

# Attendre que la DB soit prête
sleep 10

# Pousser le schéma
npm run db:push
```

#### Option B: PostgreSQL local
```bash
# Installer PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Créer la base de données
sudo -u postgres createdb streamflix
sudo -u postgres createuser streamflix_user

# Configurer le mot de passe
sudo -u postgres psql
ALTER USER streamflix_user PASSWORD 'streamflix_password';
GRANT ALL PRIVILEGES ON DATABASE streamflix TO streamflix_user;
\q

# Modifier DATABASE_URL dans .env
DATABASE_URL=postgresql://streamflix_user:streamflix_password@localhost:5432/streamflix
```

### 6. Lancement
```bash
# Mode développement
npm run dev

# Ou avec rebuild automatique
npm run dev --watch
```

L'application sera disponible sur : http://localhost:5000

## Scripts disponibles

```bash
npm run dev          # Mode développement
npm run build        # Build production
npm start            # Serveur production
npm run db:push      # Synchroniser schéma DB
```

## Vérification

### Test des API
```bash
# Tester l'API TMDB
curl "http://localhost:5000/api/movies/trending"

# Tester la base de données
curl "http://localhost:5000/api/genres"
```

### Structure attendue
```
streamflix/
├── .env                    # Variables d'environnement
├── package.json           # Dépendances
├── client/                # Frontend React
│   └── src/
├── server/                # Backend Express
└── dist/                  # Build (après npm run build)
```

## Dépannage

### Erreur TMDB_API_KEY
- Vérifier que la clé est dans `.env`
- Tester avec: `echo $TMDB_API_KEY`
- Redémarrer le serveur après modification

### Erreur Base de données
```bash
# Vérifier PostgreSQL
pg_isready

# Recreer les tables
npm run db:push

# Logs détaillés
DEBUG=* npm run dev
```

### Port déjà utilisé
```bash
# Trouver le processus sur le port 5000
lsof -ti:5000

# Le tuer
kill -9 $(lsof -ti:5000)
```

### Problème de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## Production

### Build optimisé
```bash
npm run build
npm start
```

### Docker complet
```bash
docker-compose up --build
```

## Fonctionnalités disponibles

- ✅ Navigation complète (Films, Séries, Genres, etc.)
- ✅ Recherche en temps réel
- ✅ Lecteur de bandes-annonces
- ✅ Ma Liste personnalisée
- ✅ Historique de visionnage
- ✅ Interface responsive
- ✅ Thème sombre Netflix-style

---

**Besoin d'aide ?** Ouvrir une issue sur GitHub ou consulter le README.md principal.