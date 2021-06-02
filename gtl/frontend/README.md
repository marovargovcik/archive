# gtl/backend
school project for 1st semester of top-up programme at UCN - react frontend for GTL library system

## setup
1. create .env file from .env.example template and fill required variables
2. npm install
3. use npm start for development
4. use npm run build for build
5. post build command will copy _redirects (Netlify redirects rewrites for SPA apps) to build folder

## hosting
- repository is ready to be connected to Netlify - specify to run npm run build to build app on Netlify side
- make sure that env variable REACT_APP_BACKEND_BASE_URL is set on Netlify and pointing to the accessible back-end URL