FROM node:lts-alpine

RUN mkdir /app && cd /app
ADD index.mjs package.json package-lock.json /app

RUN npm install

ENTRYPOINT ["npm start"]
