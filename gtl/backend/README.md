# gtl/backend
school project for 1st semester of top-up programme at UCN - typescript backend for GTL library system

## setup
1. generate 2 pairs of cryptographic keys with following commands:
```bash
openssl genrsa -out ./security/accessTokenPrivate.pem 4096
openssl rsa -in ./security/accessTokenPrivate.pem -pubout -out ./security/accessTokenPublic.pem
openssl genrsa -out ./security/refreshTokenPrivate.pem 4096
openssl rsa -in ./security/refreshTokenPrivate.pem -pubout -out ./security/refreshTokenPublic.pem
```
2. have ms sql ready and restore gtl.bak and gtl_remote.bak
3. have mongodb ready and create gtl database with videogames collection and import data from gtl_videogames.json
4. mongodb must be running on 127.0.0.1:27017 to be able interact with MS SQL 
5. create .configrc file in project's root directory and fill required fields (see .configrc.example).
6. npm install
7. use npm start to watch files, transpile them to javascript on detected file change and spin web server on desired port
8. use npm run build to build project (ts -> js)
9. use npm serve to serve build project on desired port

## hosting
- can be hosted on Heroku (after passing tests Docker image is created and pushed to Heroku Docker repository and from there deployed)
- deployment is preconfigured with Github actions (see .git/workflows)
- secrets must be specified on Github repository

