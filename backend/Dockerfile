# backend/Dockerfile
FROM openjdk:17-jdk-slim AS runtime

WORKDIR /app

# copy file jar đã build
COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
