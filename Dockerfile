# Dockerfile for Angular SSR Application

# =============================================================================
# Stage 1: Build the Angular SSR app
# =============================================================================
FROM node:22-alpine AS build

WORKDIR /build

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies (ci for deterministic builds)
RUN npm ci

# Copy source code
COPY . .

# Build the Angular SSR application
RUN npm run build

# =============================================================================
# Stage 2: Production runtime
# =============================================================================
FROM node:22-alpine

WORKDIR /app

# Copy the Angular SSR build output
COPY --from=build /build/dist/containerized-angular-ssr-app-example ./dist

# Set default port
ENV PORT=4000

# Expose the port
EXPOSE 4000

# Start the SSR server
CMD ["node", "dist/server/server.mjs"]
