# Stage 1: Build app
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build ra thư mục dist
RUN npm run build

# Stage 2: Nginx serve static files
FROM nginx:alpine

# Copy file build ra Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config nếu cần (tùy chỉnh router history mode của Vue)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
