# === Build stage ===
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# === Production stage ===
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --only=production --legacy-peer-deps

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]