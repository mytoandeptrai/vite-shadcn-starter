# Multi-stage build for Vite React app

# 1) Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm and dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm \
  && pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# 2) Runtime stage (Nginx)
FROM nginx:1.27-alpine

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
