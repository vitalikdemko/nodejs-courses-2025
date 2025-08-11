# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci || npm i

COPY . .
RUN npx esbuild index.js \
  --bundle --platform=node --format=esm --sourcemap \
  --packages=external \
  --outfile=dist/server.mjs

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist /app/dist
COPY --from=build /app/docs /app/docs
COPY --from=build /app/package*.json ./

RUN npm ci --omit=dev || npm i --omit=dev

EXPOSE 3000
CMD ["node", "--enable-source-maps", "dist/server.mjs"]