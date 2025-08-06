-- Initialisation de la base de données StreamFlix
-- Ce fichier est utilisé automatiquement par Docker lors du premier démarrage

-- Créer la base de données si elle n'existe pas
SELECT 'CREATE DATABASE streamflix'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'streamflix')\gexec

-- Se connecter à la base de données
\c streamflix;

-- Créer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tables principales (seront créées par Drizzle, mais on peut les préparer)
-- Note: Drizzle ORM gère automatiquement les migrations

-- Utilisateur par défaut pour les tests
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'streamflix_user') THEN
    CREATE USER streamflix_user WITH PASSWORD 'streamflix_password';
    GRANT ALL PRIVILEGES ON DATABASE streamflix TO streamflix_user;
    GRANT ALL ON SCHEMA public TO streamflix_user;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO streamflix_user;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO streamflix_user;
  END IF;
END
$$;

-- Configuration pour l'optimisation
ALTER DATABASE streamflix SET timezone TO 'UTC';

-- Message de confirmation
SELECT 'Base de données StreamFlix initialisée avec succès!' as message;