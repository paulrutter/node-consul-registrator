FROM node:lts-alpine

RUN mkdir /app && cd /app
ADD index.mjs package.json package-lock.json

RUN npm install

ENTRYPOINT ["npm start"]
