# restapi-v-graphql
school project for 1st semester of top-up programme at UCN - graphql and rest api built over the same database for direct response time comparison

# setup
1. create database and import data from migrations/init.sql
2. create .env file from .env.example and add required variables
3. npm install
4. use npm start to spin a web server on PORT you specified in .env file

# benchmarking
benchmarks can be found in src/benchmarks folder. they are meant to be executed from the browser. launcher.js suggest the way how execute benchmarks repeatedly n times.