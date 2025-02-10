# Étape 1 : Construction de l'application React
FROM node:16 AS build

WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY ./package*.json ./

# Installation des dépendances
RUN npm i web-vitals --save-dev

# Copie du reste du code
COPY ./ .

# Construction de l'application
RUN npm run build

# Étape 2 : Serveur Nginx pour servir l'application React
FROM nginx:alpine

# Copie des fichiers construits dans le répertoire de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposition du port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]