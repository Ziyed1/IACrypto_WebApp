FROM node:21.7.3-alpine as server

WORKDIR /app

COPY package*.json ./

RUN npm init -y

RUN npm install

COPY . .

RUN apk add --no-cache mongodb-tools

RUN echo "const express = require('express'); \
          const cors = require('cors'); \
          const path = require('path'); \
          const app = express(); \
          const PORT = process.env.PORT || 3001; \
          app.use(express.json()); \
	  app.use(cors()); \
          app.listen(PORT, () => { \
            console.log(\`Server is running on port \${PORT}\`); \
          });" > server.js

EXPOSE 3001

CMD ["node", "server.js"]

