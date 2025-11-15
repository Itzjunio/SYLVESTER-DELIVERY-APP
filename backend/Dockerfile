FROM node:lts-alpine
# ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
# RUN npm ci --only=production --silent
COPY --chown=node:node . .
EXPOSE 3000
# USER node
CMD ["npm", "start"]



