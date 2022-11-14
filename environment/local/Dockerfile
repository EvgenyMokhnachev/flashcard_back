FROM node:19.0.0-alpine3.15

RUN npm install --global -y webpack webpack-cli mocha ts-node nodemon

WORKDIR /app

COPY ./environment/local/entrypoint-frontend.sh /entrypoint-frontend.sh
RUN chmod +x /entrypoint-frontend.sh

COPY ./environment/local/entrypoint-backend.sh /entrypoint-backend.sh
RUN chmod +x /entrypoint-backend.sh
