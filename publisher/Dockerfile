FROM node:22.16.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm i
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Stage 2: Runtime
FROM node:22.16.0-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package.json ./

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
