How to use npm install:
```bash
./node.sh npm install --save-dev mocha
```

How to start development:
```bash
./start-dev.sh
```

How to build AWS Lambda
```bash
rm -rf ./dist && npm run build && cd dist && zip -r function.zip built.js && cd ..
```
and upload the folder to AWS as zip and config handler like:
```bash
Handler
built.handlers.AuthHandler
```
