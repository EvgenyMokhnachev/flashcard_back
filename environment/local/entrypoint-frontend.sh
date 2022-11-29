#!/bin/sh
cd /app
npm install
webpack --config /app/configs/frontend/webpack.config.frontend.js
