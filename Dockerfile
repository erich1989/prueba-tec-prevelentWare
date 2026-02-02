# Al añadir dependencias (p. ej. react-apexcharts): reconstruir imagen con: docker-compose build --no-cache frontend
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# Copiar el resto de los archivos (incluye prisma/schema.prisma)
COPY . .

# Generar el cliente de Prisma (Better Auth lo usa en lib/auth.ts)
RUN npx prisma generate

# Exponer el puerto 3000
EXPOSE 3000

# Ejecutar prisma generate al arrancar (el volumen /app/node_modules puede no tener el cliente generado)
# y luego iniciar el servidor de desarrollo
CMD ["sh", "-c", "npx prisma generate && npm run dev"]
