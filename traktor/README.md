# Traktor
school project for 5th semester of ap degree programme at ucn - front-end and back-end built on top of trakt.tv API

# back-end setup (packages/server)
1. create database and import data from migrations/init.sql
2. create .env file from .env.example and add required variables
3. npm install
4. use npm start to spin a web server on PORT you specified in .env file

# front-end setup (packages/spa)
2. create .env file from .env.example and add required variables
3. npm install
4. use npm start to development
5. use npm run build to build the app and postbuild step will copy build directory to packages/server/public/spa and makes it available for back-end to be deployed
6. make sure that proxy in package.json points to correct URL of back-end as any API requests are supposed to be forwarded to the back-end