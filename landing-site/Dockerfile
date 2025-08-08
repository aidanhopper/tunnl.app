# Use the official Node.js LTS image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build the Astro project
RUN npm run build

# --------------------------------------------

# Serve the built site using a lightweight server (optional)
FROM node:18-alpine AS runner

WORKDIR /app

# Install only production dependencies (optional)
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Copy built site
COPY --from=builder /app/dist ./dist

# Serve with `serve` or your own server (e.g., Express)
RUN npm install -g serve

# Expose port (default Astro port is 4321; serve defaults to 3000)
EXPOSE 3000

# Start server
CMD ["serve", "-s", "dist", "-l", "3000"]
