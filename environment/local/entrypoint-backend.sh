#!/bin/sh
cd /app
npm install
mkdir /app/dist
echo "console.log(\"Nodemon STARTED!\")" > /app/dist/backend.bundle.js
nodemon --inspect=0.0.0.0:9222 --watch /app/dist /app/dist/backend.bundle.js &
webpack --config /app/webpack.config.js
