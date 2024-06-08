# FROM node:18 AS build

# WORKDIR /usr/src/app

# COPY package.json package-lock.json ./
# COPY prisma ./prisma/
# COPY . .

# RUN npm install
# COPY . .
# RUN npm run build
# RUN npm prune --production

# FROM node:18-alpine3.19

# WORKDIR /usr/src/app

# COPY --from=build /usr/src/app/package.json ./package.json
# COPY --from=build /usr/src/app/dist ./dist
# COPY --from=build /usr/src/app/node_modules ./node_modules
# COPY --from=build /usr/src/app/prisma ./prisma

# EXPOSE 3333

# CMD [  "npm", "run", "start:migrate:prod" ]
# CMD ["index.handler"]



# # Pipeline for AWS Lambda

# # Use uma imagem base oficial da AWS Lambda para Node.js
# FROM public.ecr.aws/lambda/nodejs:18

# # Copie os arquivos necessários para a imagem
# COPY package.json package-lock.json ./
# COPY prisma ./prisma/
# COPY . .

# # Instale as dependências e construa a aplicação
# RUN npm install
# RUN npm run build
# RUN npm prune --production

# # Copie os arquivos de construção para o diretório Lambda
# COPY --from=build /usr/src/app/package.json ./package.json ${LAMBDA_TASK_ROOT}/package.json
# COPY --from=build /usr/src/app/dist ./dist ${LAMBDA_TASK_ROOT}/dist
# COPY --from=build /usr/src/app/node_modules ./node_modules ${LAMBDA_TASK_ROOT}/node_modules
# COPY --from=build /usr/src/app/prisma ./prisma ${LAMBDA_TASK_ROOT}/prisma

# # Defina o comando de inicialização do Lambda
# CMD ["index.handler"]

# Use uma imagem base oficial da AWS Lambda para Node.js
FROM public.ecr.aws/lambda/nodejs:18

# Defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos necessários para a imagem
COPY package.json package-lock.json ./
COPY prisma ./prisma/
COPY . .

# Instale as dependências e construa a aplicação
RUN npm install
RUN npm run build
RUN npm prune --production

# Copie os arquivos de construção para o diretório Lambda
COPY package.json ./package.json
COPY dist ./dist
COPY node_modules ./node_modules
COPY prisma ./prisma

# Defina o comando de inicialização do Lambda
CMD ["index.handler"]

