# Étape 1 : Construction de l'application Node.js
FROM node:16

WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY ./package*.json ./

# Installation des dépendances
RUN RUN npm i web-vitals --save-dev --legacy-peer-deps

# Copie du reste du code
COPY ./ .

# Exposition du port sur lequel l'API va tourner
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["npm", "start"]