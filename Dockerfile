FROM node:18 AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
COPY . .

RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:18-alpine3.19

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/prisma ./prisma

EXPOSE 3333

CMD [  "npm", "run", "start:migrate:prod" ]