#!/bin/bash

# Script d'installation automatique pour StreamFlix
echo "🎬 Installation de StreamFlix - Plateforme de Streaming"
echo "=================================================="

# Fonction pour vérifier les commandes
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 n'est pas installé"
        return 1
    else
        echo "✅ $1 trouvé"
        return 0
    fi
}

# Fonction pour installer Node.js sur différents systèmes
install_nodejs() {
    echo "📦 Installation de Node.js..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Debian/Ubuntu
        if command -v apt &> /dev/null; then
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        # CentOS/RHEL/Fedora
        elif command -v yum &> /dev/null || command -v dnf &> /dev/null; then
            curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
            if command -v dnf &> /dev/null; then
                sudo dnf install -y nodejs
            else
                sudo yum install -y nodejs
            fi
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS avec Homebrew
        if command -v brew &> /dev/null; then
            brew install node@18
        else
            echo "⚠️  Homebrew non trouvé. Installez Node.js depuis https://nodejs.org/"
            exit 1
        fi
    else
        echo "⚠️  Système non supporté. Installez Node.js manuellement depuis https://nodejs.org/"
        exit 1
    fi
}

# Vérifications préliminaires
echo "🔍 Vérification des prérequis..."

# Vérifier Node.js
if ! check_command node; then
    read -p "Voulez-vous installer Node.js automatiquement? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_nodejs
    else
        echo "Veuillez installer Node.js depuis https://nodejs.org/ puis relancer ce script"
        exit 1
    fi
fi

# Vérifier npm
if ! check_command npm; then
    echo "❌ npm devrait être installé avec Node.js"
    exit 1
fi

# Vérifier Git (optionnel)
check_command git

# Afficher les versions
echo ""
echo "📋 Versions installées:"
echo "   Node.js: $(node -v)"
echo "   npm: $(npm -v)"
echo ""

# Installation des dépendances
echo "📦 Installation des dépendances du projet..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo "✅ Dépendances installées avec succès"

# Configuration de l'environnement
echo ""
echo "⚙️  Configuration de l'environnement..."

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Fichier .env créé depuis .env.example"
    else
        echo "⚠️  .env.example introuvable, création d'un .env minimal"
        cat > .env << EOF
# Base de données PostgreSQL (optionnel pour le développement)
DATABASE_URL=postgresql://localhost:5432/streamflix

# API TMDB (OBLIGATOIRE)
TMDB_API_KEY=your_api_key_here

# Environnement
NODE_ENV=development
EOF
    fi
    
    echo ""
    echo "📝 CONFIGURATION REQUISE:"
    echo "   1. Obtenez une clé API TMDB gratuite:"
    echo "      -> Allez sur https://www.themoviedb.org/"
    echo "      -> Créez un compte"
    echo "      -> Allez dans Paramètres > API"
    echo "      -> Copiez votre clé API v3"
    echo ""
    echo "   2. Éditez le fichier .env:"
    echo "      -> Remplacez 'your_api_key_here' par votre vraie clé API"
    echo ""
    
    read -p "Appuyez sur Entrée pour ouvrir le fichier .env dans votre éditeur par défaut..."
    
    # Ouvrir l'éditeur
    if command -v code &> /dev/null; then
        code .env
    elif command -v nano &> /dev/null; then
        nano .env
    elif command -v vim &> /dev/null; then
        vim .env
    else
        echo "Éditez manuellement le fichier .env avec votre éditeur préféré"
    fi
else
    echo "✅ Fichier .env déjà existant"
fi

# Installation optionnelle de PostgreSQL
echo ""
read -p "Voulez-vous configurer PostgreSQL pour la base de données? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🐘 Configuration de PostgreSQL..."
    
    # Vérifier si PostgreSQL est installé
    if ! check_command psql; then
        echo "📦 Installation de PostgreSQL..."
        
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            if command -v apt &> /dev/null; then
                sudo apt update
                sudo apt install -y postgresql postgresql-contrib
                sudo systemctl start postgresql
                sudo systemctl enable postgresql
            elif command -v yum &> /dev/null || command -v dnf &> /dev/null; then
                if command -v dnf &> /dev/null; then
                    sudo dnf install -y postgresql postgresql-server postgresql-contrib
                else
                    sudo yum install -y postgresql postgresql-server postgresql-contrib
                fi
                sudo postgresql-setup initdb
                sudo systemctl start postgresql
                sudo systemctl enable postgresql
            fi
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            if command -v brew &> /dev/null; then
                brew install postgresql
                brew services start postgresql
            fi
        fi
    fi
    
    # Créer la base de données
    echo "🔧 Création de la base de données StreamFlix..."
    
    # Essayer de créer la DB
    sudo -u postgres psql << EOF
CREATE DATABASE streamflix;
CREATE USER streamflix_user WITH PASSWORD 'streamflix_password';
GRANT ALL PRIVILEGES ON DATABASE streamflix TO streamflix_user;
\q
EOF
    
    # Mettre à jour l'URL dans .env
    sed -i.bak 's|DATABASE_URL=.*|DATABASE_URL=postgresql://streamflix_user:streamflix_password@localhost:5432/streamflix|' .env
    
    echo "✅ Base de données configurée"
    
    # Pousser le schéma
    npm run db:push
else
    echo "⚠️  Base de données ignorée. L'application fonctionnera en mémoire."
fi

# Test final
echo ""
echo "🧪 Test de la configuration..."

# Charger les variables d'environnement
set -a
source .env 2>/dev/null || true
set +a

if [ ! -z "$TMDB_API_KEY" ] && [ "$TMDB_API_KEY" != "your_api_key_here" ]; then
    # Test de l'API TMDB
    TMDB_TEST=$(curl -s "https://api.themoviedb.org/3/genre/movie/list?api_key=$TMDB_API_KEY" | grep -c "genres" 2>/dev/null || echo "0")
    
    if [ "$TMDB_TEST" -gt 0 ]; then
        echo "✅ API TMDB fonctionnelle"
    else
        echo "⚠️  Problème avec l'API TMDB. Vérifiez votre clé."
    fi
else
    echo "⚠️  Clé API TMDB non configurée"
fi

# Message de fin
echo ""
echo "🎉 Installation terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Assurez-vous que le fichier .env est correctement configuré"
echo "   2. Lancez l'application:"
echo "      ./start-dev.sh"
echo "      ou"
echo "      npm run dev"
echo ""
echo "   3. Ouvrez votre navigateur sur http://localhost:5000"
echo ""
echo "📚 Documentation complète: README.md"
echo "🆘 Aide: local-setup.md"
echo ""
echo "Bon streaming! 🍿"