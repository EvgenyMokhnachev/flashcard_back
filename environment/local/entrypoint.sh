#!/bin/sh
cd /app
npm install
webpack --config /app/webpack.config.js
