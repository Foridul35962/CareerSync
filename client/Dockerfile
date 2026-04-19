FROM node:20-alpine

WORKDIR /client

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev", "--", "--webpack"]