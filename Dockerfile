# ---- Etapa de Build ----
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copia los archivos de dependencias e instala
COPY package*.json ./
RUN npm install

# Copia el resto del código fuente
COPY . .

# Construye la aplicación para producción
RUN npm run build

# ---- Etapa de Producción ----
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia solo los artefactos necesarios desde la etapa de build
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

# Expone el puerto en el que corre la aplicación
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]