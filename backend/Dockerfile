# Stage 1: Build dependencies
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --production

# Copy toàn bộ source code
COPY . .

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Copy từ stage build
COPY --from=build /app /app

# Expose port backend (ví dụ 5000)
EXPOSE 5000

# Start app
CMD ["npm", "start"]
