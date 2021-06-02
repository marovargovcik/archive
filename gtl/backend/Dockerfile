FROM node:14-alpine

WORKDIR /var/app/current
COPY . .
RUN npm install
RUN npm run build
RUN npm install pm2 -g
CMD ["pm2-runtime", "dist/server.js"]
