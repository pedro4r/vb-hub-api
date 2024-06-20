# FROM node:18 AS build

# WORKDIR /usr/src/app

# COPY package.json package-lock.json ./
# COPY prisma ./prisma/
# COPY . .

# RUN npm install
# COPY . .
# RUN npm run build
# RUN npm prune --production

# # FROM node:18-alpine3.19
# FROM public.ecr.aws/lambda/nodejs:18

# WORKDIR /usr/src/app

# COPY --from=build /usr/src/app/package.json ./package.json
# COPY --from=build /usr/src/app/dist ./dist
# COPY --from=build /usr/src/app/node_modules ./node_modules
# COPY --from=build /usr/src/app/prisma ./prisma

# # EXPOSE 3333

# # CMD [  "npm", "run", "start:migrate:prod" ]
# CMD ["index.handler"]








#TEST
# Defina o estágio de construção
FROM node:18 AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
COPY . .

RUN npm install
RUN npm run build
RUN npm prune --production

# Defina o estágio de produção
FROM public.ecr.aws/lambda/nodejs:18

WORKDIR /var/task

COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/dist/src/infra/lambd.js ./lambda.js


CMD ["dist/src/infra/lambda.handler"]









# Etapa final
# FROM public.ecr.aws/lambda/nodejs:18

# WORKDIR /var/task

# COPY --from=build /usr/src/app/package.json ./package.json
# COPY --from=build /usr/src/app/dist ./dist
# COPY --from=build /usr/src/app/node_modules ./node_modules
# COPY --from=build /usr/src/app/prisma ./prisma

# # Inclua o arquivo index.js para definir o handler
# COPY --from=build /usr/src/app/dist/src/infra/index.js ./index.js

# # Defina o comando de inicialização do Lambda
# CMD ["index.handler"]
