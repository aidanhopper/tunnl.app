# Use Node.js v22.16.0 as base image
FROM node:22.16.0-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Install TypeScript globally and dev dependencies for build
RUN npm install -g typescript && npm install --only=dev

# Build TypeScript to JavaScript
RUN npm run build

# Remove dev dependencies and TypeScript compiler to reduce image size
RUN npm prune --production && npm uninstall -g typescript

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership of app directory to nodejs user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port (adjust as needed)
EXPOSE 3444

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Start the application
CMD ["node", "dist/index.js"]
