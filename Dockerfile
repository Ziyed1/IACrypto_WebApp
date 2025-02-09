# Étape 1 : Construction de l'application Node.js
FROM node:16

WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY backend/package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code
COPY backend/ .

# Exposition du port sur lequel l'API va tourner
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["npm", "start"]