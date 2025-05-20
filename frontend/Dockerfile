FROM node:23.10.0

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

COPY frontend/* ./

RUN npm run build

CMD ["npm", "run", "start"] 