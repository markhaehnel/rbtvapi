FROM node:10-alpine

ENV NODE_ENV=production
ENV HOST=0.0.0.0

WORKDIR /app
COPY . /app

RUN yarn install --production

EXPOSE 3000
CMD yarn start
