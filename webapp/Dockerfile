FROM node:22.16.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
RUN npm ci
COPY . .
RUN npm run build

FROM node:22.16.0 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
CMD ["node", "server.js"]
