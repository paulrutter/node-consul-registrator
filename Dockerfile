FROM node:lts-alpine

WORKDIR /app 
ADD index.mjs package.json package-lock.json /app

RUN npm install

ENTRYPOINT ["npm start"]
