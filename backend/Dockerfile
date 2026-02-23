FROM gradle:7.6-jdk17 AS build

COPY --chown=gradle:gradle burning-okr /home/gradle/src
WORKDIR /home/gradle/src

RUN gradle bootJar --no-daemon

FROM eclipse-temurin:17-jre

EXPOSE 8080
WORKDIR /app

COPY --from=build /home/gradle/src/burning-okr-app/build/libs/*.jar /app/burning-okr.jar

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app/burning-okr.jar"]
