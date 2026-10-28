# ==========================================
# TaskFlow Frontend - Multi-Stage Dockerfile
# Practical 11: Containerization with Docker
# ==========================================

# Stage 1: Build the Vite React bundle
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the production build
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy built distribution from Stage 1
COPY --from=build /app/dist ./dist

# Expose Vite preview port
EXPOSE 5173

# Bind to 0.0.0.0 to enable host-to-container port mapping
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
