FROM node:21.7.3-alpine

WORKDIR /app

COPY package*.json .

RUN npm install -g npm@10.8.1

RUN npm install -g create-react-app

RUN create-react-app soccershototsu

WORKDIR /app/soccershototsu

RUN npm install

RUN npm run build

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

