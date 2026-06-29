#intially use node to compile javascript into html then throw away and use lightweight nginx to run
FROM node:20-alpine AS builder
WORKDIR /blinkapp

# Copy dependency files first to utilize Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy your source code and compile the production build
COPY . .
RUN npm run build

# === STAGE 2: The Production Server ===
FROM nginx:alpine

# 1. Copy your custom Nginx configurations into the system core
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 2. Copy the compiled static assets from Vite's build folder into Nginx
COPY --from=builder /blinkapp/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]