FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copia os arquivos necessários
COPY package.json package-lock.json ./
COPY prisma ./prisma/
COPY . .

# Instala dependências e compila a aplicação
RUN npm install
RUN npm run build
RUN npm prune --production

# Fase final para produção
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia os artefatos da fase de build
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/prisma ./prisma

EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]