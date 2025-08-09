FROM node:22.16.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
RUN npm ci
COPY . .
RUN npm run build

FROM node:22.16.0 AS runner
WORKDIR /app

# Install dbmate and postgresql client
RUN apt-get update && apt-get install -y wget postgresql-client && rm -rf /var/lib/apt/lists/*
RUN wget -q -O /usr/local/bin/dbmate https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64
RUN chmod +x /usr/local/bin/dbmate

ENV NODE_ENV=production
ENV PORT=3000

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy database migrations
COPY --from=builder /app/db ./db

# Create and copy entrypoint script
COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "server.js"]
