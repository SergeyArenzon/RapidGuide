
# Stage 1: Build stage
FROM node:24-alpine AS builder
# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.build.json nest-cli.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# Copy the source code
COPY src/ ./src/

# Build the application
RUN pnpm run build

# Remove development dependencies
RUN pnpm prune --prod


# Stage 2: Production stage
FROM node:24-alpine AS runner
WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/package.json ./

# Set necessary environment variables
ENV NODE_ENV=production

EXPOSE 3000
WORKDIR /app/dist

# Start the application
CMD ["node", "main.js"] 