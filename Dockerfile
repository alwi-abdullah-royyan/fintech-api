# Use Node base image
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build NestJS
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
