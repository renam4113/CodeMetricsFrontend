## Multi-stage build for Vue app with Nginx

# 1) Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Build
COPY . .
RUN npm run build

# 2) Runtime stage
FROM nginx:1.25-alpine

# Replace default site config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

