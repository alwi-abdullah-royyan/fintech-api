# Base image
FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Copy prisma schema BEFORE dependencies
COPY prisma ./prisma

# Install dependencies (postinstall will now work)
RUN pnpm install --frozen-lockfile

# Copy the rest of your app
COPY . .

# Build NestJS
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
