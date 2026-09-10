# ==========================================================
# CabGo Backend - Multi-stage Cloud Container
# Subdirectory Dockerfile (context: ./backend)
# ==========================================================

# Stage 1: Build JAR with Eclipse Temurin 17 JDK
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /workspace

# Copy Maven wrapper and POM for layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Normalize line endings and set execution permission
RUN sed -i 's/\r$//' ./mvnw && chmod +x ./mvnw

# Pre-fetch project dependencies offline
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and package application
COPY src/ ./src/
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Minimal, secure JRE runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create dedicated non-root user and group
RUN groupadd --system --gid 1001 appgroup && \
    useradd --system --uid 1001 --gid appgroup appuser

# Copy executable jar from builder stage
COPY --from=builder --chown=appuser:appgroup /workspace/target/*.jar app.jar

# Run container as non-root user
USER appuser

# Render dynamically passes PORT; default fallback 8088
EXPOSE 8088

ENV PORT=8088 \
    SPRING_PROFILES_ACTIVE=postgres \
    JAVA_OPTS="-Xms256m -Xmx400m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -Dserver.port=${PORT} -jar app.jar"]
