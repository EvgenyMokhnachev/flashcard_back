FROM node:18.17.0

RUN npm install --global -y esbuild

WORKDIR /app

COPY ./environment/server/entrypoint-backend.sh /entrypoint-backend.sh
RUN chmod +x /entrypoint-backend.sh

COPY ./package.json /app/package.json
RUN npm i

COPY ./ /app

RUN npm i
RUN esbuild /app/src/main/main.ts --bundle --minify --platform=node --target=node14 --outfile=/app/dist/built.js
