FROM node:23.10.0

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

CMD ["npm", "run", "start"] 