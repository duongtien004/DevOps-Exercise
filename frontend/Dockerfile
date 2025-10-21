# Stage 1: Build app
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build ra thư mục dist (với Vue) hoặc build (với React)
RUN npm run build

# Stage 2: Nginx serve static files
FROM nginx:alpine

# Copy file build ra Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# hoặc nếu là React:
# COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config nếu cần router mode
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
