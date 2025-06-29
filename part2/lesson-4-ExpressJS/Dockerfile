# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx esbuild index.js --bundle --platform=node --format=cjs --outfile=dist/server.js

# Stage 2: Final image
FROM node:18-alpine
WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json ./

RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "dist/server.js"]