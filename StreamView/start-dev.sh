#!/bin/bash

# Script de démarrage pour StreamFlix en mode développement
echo "🎬 Démarrage de StreamFlix..."

# Vérification de Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
    exit 1
fi

# Vérification de la version Node.js
NODE_VERSION=$(node -v | cut -c2-)
REQUIRED_VERSION="18.0.0"

if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"

# Vérification du fichier .env
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env manquant. Création depuis .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📝 Veuillez éditer le fichier .env avec vos clés API"
        echo "   - TMDB_API_KEY: Obtenez votre clé sur https://www.themoviedb.org/"
        echo "   - DATABASE_URL: URL de votre base PostgreSQL"
        read -p "Appuyez sur Entrée une fois le fichier .env configuré..."
    else
        echo "❌ .env.example introuvable"
        exit 1
    fi
fi

# Chargement des variables d'environnement
set -a
source .env
set +a

# Vérification des variables critiques
if [ -z "$TMDB_API_KEY" ]; then
    echo "❌ TMDB_API_KEY manquant dans .env"
    echo "   Obtenez votre clé sur: https://www.themoviedb.org/settings/api"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL manquant. Utilisation de la base de données par défaut"
fi

echo "✅ Variables d'environnement chargées"

# Installation des dépendances si nécessaire
if [ ! -d node_modules ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Vérification de PostgreSQL si une URL est fournie
if [ ! -z "$DATABASE_URL" ]; then
    echo "🔍 Vérification de la base de données..."
    
    # Test de connexion simple
    if command -v psql &> /dev/null; then
        if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
            echo "✅ Connexion à la base de données réussie"
            
            # Synchronisation du schéma
            echo "🔄 Synchronisation du schéma de base de données..."
            npm run db:push
        else
            echo "⚠️  Impossible de se connecter à la base de données"
            echo "   L'application fonctionnera en mode mémoire"
        fi
    else
        echo "⚠️  psql non installé, impossible de tester la connexion DB"
    fi
fi

# Test de l'API TMDB
echo "🔍 Test de l'API TMDB..."
TMDB_TEST=$(curl -s "https://api.themoviedb.org/3/genre/movie/list?api_key=$TMDB_API_KEY" | grep -c "genres" || echo "0")

if [ "$TMDB_TEST" -gt 0 ]; then
    echo "✅ API TMDB fonctionnelle"
else
    echo "❌ Erreur avec l'API TMDB. Vérifiez votre clé API."
    exit 1
fi

# Nettoyage du port si nécessaire
PORT=${PORT:-5000}
if lsof -ti:$PORT > /dev/null 2>&1; then
    echo "⚠️  Port $PORT déjà utilisé. Tentative de libération..."
    kill -9 $(lsof -ti:$PORT) 2>/dev/null || true
    sleep 2
fi

echo ""
echo "🚀 Lancement de StreamFlix en mode développement..."
echo "   📱 Interface: http://localhost:$PORT"
echo "   🔧 Mode: development"
echo "   📊 Hot reload: activé"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Démarrage du serveur
npm run dev