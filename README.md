# studentPortal

# To run application on your local machine

- clone the app on your pc
- ADD .env file in root directory and following variable data

```
NODE_ENV='development'
MONGODB_URI='mongodb://localhost:27017/fypManagement'
jwtsecret='ThisisaSecret'

```

- in app directory use the following commads this for produtction mode

```
$ npm install
$ cd client
$ npm install
$ npm run build
$ cd..
$ npm start

```

# to run application in development mode

- open two terminals one in server root directory and one in client folder
- use following commands in both terminals
- before starting the client site change the config/config.js variables according to your needs change the url and env

```
$ npm install
$ npm start

```
