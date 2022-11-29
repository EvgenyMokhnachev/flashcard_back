#!/bin/sh
cd /app
npm install
mkdir /app/dist
echo "console.log(\"nodemon started  !!! \")" > /app/dist/backend.bundle.js
nodemon --inspect=0.0.0.0:9222 --watch /app/dist /app/dist/backend.bundle.js &
webpack --config /app/configs/backend/webpack.config.backend.js
