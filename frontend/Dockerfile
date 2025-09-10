# frontend/Dockerfile
FROM node:18-alpine AS build

WORKDIR /app

# copy package.json và cài deps
COPY package*.json ./
RUN npm install

# copy toàn bộ source
COPY . .

# build sản phẩm
RUN npm run build

# Stage 2: phục vụ với nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
