# Stage 1: Build dependencies
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependencies files
COPY package*.json ./

# Cài dependencies (chỉ production để giảm dung lượng)
RUN npm install --production

# Copy toàn bộ source code
COPY . .

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Copy từ stage build
COPY --from=build /app /app

# Biến môi trường mặc định
ENV NODE_ENV=production
ENV PORT=8088
ENV HOST=0.0.0.0

# Expose port
EXPOSE 8088

# Start app
CMD ["npm", "start"]
