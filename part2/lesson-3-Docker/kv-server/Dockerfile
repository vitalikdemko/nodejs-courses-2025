# builder stage
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY ./src ./src

# runtime stage
FROM node:18-alpine AS runtime
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

EXPOSE 3000
CMD ["node", "src/server.js"]