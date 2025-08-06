# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

# Copier les fichiers de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S streamflix -u 1001

# Changer la propriété des fichiers
USER streamflix

EXPOSE 5000

# Variables d'environnement
ENV NODE_ENV=production

# Commande de démarrage
CMD ["npm", "start"]