# Guide d'Installation - StreamFlix

## Installation Automatique (Recommandé)

### Méthode 1: Script d'installation automatique
```bash
# Cloner le repository
git clone <votre-repo-url>
cd streamflix

# Lancer l'installation automatique
chmod +x install.sh
./install.sh
```

### Méthode 2: Installation manuelle

#### 1. Prérequis
- Node.js 18+ ([télécharger](https://nodejs.org/))
- PostgreSQL (optionnel)
- Compte TMDB (gratuit)

#### 2. Installation des dépendances
```bash
npm install
```

#### 3. Configuration des variables d'environnement

Copier le fichier d'exemple :
```bash
cp .env.example .env
```

Éditer le fichier `.env` avec vos valeurs :

```env
# API TMDB (OBLIGATOIRE)
TMDB_API_KEY=votre_cle_tmdb_ici

# Base de données PostgreSQL (optionnel)
DATABASE_URL=postgresql://user:password@localhost:5432/streamflix

# Environnement
NODE_ENV=development
```

#### 4. Obtenir une clé API TMDB

1. Aller sur [themoviedb.org](https://www.themoviedb.org/)
2. Créer un compte gratuit
3. Aller dans **Paramètres** → **API**
4. Copier votre **clé API v3**
5. Remplacer `votre_cle_tmdb_ici` dans le fichier `.env`

#### 5. Configuration de la base de données (optionnel)

**Option A: PostgreSQL local**
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Créer la base de données
sudo -u postgres createdb streamflix
sudo -u postgres createuser streamflix_user --pwprompt

# Modifier DATABASE_URL dans .env
DATABASE_URL=postgresql://streamflix_user:password@localhost:5432/streamflix
```

**Option B: Docker**
```bash
docker-compose up -d postgres
```

#### 6. Lancement

**Mode développement:**
```bash
npm run dev
```

**ou avec le script de démarrage:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

L'application sera disponible sur **http://localhost:5000**

## Scripts Disponibles

```bash
npm run dev          # Mode développement avec hot reload
npm run build        # Build pour production
npm start            # Serveur production
npm run db:push      # Synchroniser schéma base de données
```

## Docker (Production)

### Avec Docker Compose
```bash
# Lancer tous les services
docker-compose up --build

# En arrière-plan
docker-compose up -d --build
```

### Docker seul
```bash
# Build de l'image
docker build -t streamflix .

# Lancer le container
docker run -p 5000:5000 --env-file .env streamflix
```

## Vérification de l'installation

### Test des composants
```bash
# Tester l'API TMDB
curl "http://localhost:5000/api/movies/trending"

# Tester les genres
curl "http://localhost:5000/api/genres"

# Vérifier PostgreSQL (si configuré)
psql $DATABASE_URL -c "SELECT 1;"
```

### Interface web
1. Ouvrir **http://localhost:5000**
2. Vérifier la page d'accueil
3. Tester la navigation (Films, Séries, Genres)
4. Essayer la recherche

## Dépannage

### Erreurs communes

**"TMDB_API_KEY is required"**
- Vérifier que la clé API est dans `.env`
- Redémarrer le serveur après modification

**"Port 5000 already in use"**
```bash
# Trouver le processus
lsof -ti:5000

# Le tuer
kill -9 $(lsof -ti:5000)
```

**Erreur de base de données**
```bash
# Vérifier PostgreSQL
pg_isready

# Recréer les tables
npm run db:push
```

**Problèmes de dépendances**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Logs de debug
```bash
# Logs détaillés
DEBUG=* npm run dev

# Logs serveur uniquement
NODE_ENV=development npm run dev
```

## Structure des fichiers

```
streamflix/
├── .env                    # Variables d'environnement
├── .env.example           # Template de configuration
├── install.sh             # Script d'installation
├── start-dev.sh           # Script de démarrage
├── docker-compose.yml     # Configuration Docker
├── package.json           # Dépendances Node.js
├── client/                # Frontend React
│   └── src/
├── server/                # Backend Express
└── shared/                # Schémas partagés
```

## Configuration avancée

### Variables d'environnement complètes
```env
# API TMDB
TMDB_API_KEY=your_api_key

# Base de données
DATABASE_URL=postgresql://user:pass@host:port/db
PGHOST=localhost
PGPORT=5432
PGUSER=streamflix_user
PGPASSWORD=password
PGDATABASE=streamflix

# Serveur
NODE_ENV=development
PORT=5000

# Sécurité (production)
SESSION_SECRET=your_session_secret
```

### Configuration Nginx (production)
```nginx
server {
    listen 80;
    server_name streamflix.local;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## Support

- 📖 Documentation: `README.md`
- 🔧 Guide technique: `local-setup.md`
- 🐛 Issues: GitHub Issues
- 📧 Contact: [votre-email]

---

**StreamFlix** - Votre plateforme de streaming moderne 🎬