FROM node:lts-alpine

ADD index.mjs package.json package-lock.json

RUN npm install

ENTRYPOINT ["npm start"]
