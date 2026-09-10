package com.cabgo.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

/**
 * Smart Database URL Adapter for Render Cloud Deployment.
 * Detects and transforms Render's managed PostgreSQL connection strings
 * (e.g., postgres://user:password@host:port/database) into standard JDBC format.
 */
@Configuration
@Profile("postgres")
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    private final Environment environment;

    @Value("${spring.datasource.url:}")
    private String fallbackUrl;

    @Value("${spring.datasource.username:postgres}")
    private String fallbackUsername;

    @Value("${spring.datasource.password:postgres}")
    private String fallbackPassword;

    public DatabaseConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean
    @Primary
    public DataSource dataSource() {
        // Render injects DATABASE_URL or INTERNAL_DATABASE_URL
        String rawDatabaseUrl = environment.getProperty("DATABASE_URL");
        if (rawDatabaseUrl == null || rawDatabaseUrl.isBlank()) {
            rawDatabaseUrl = environment.getProperty("INTERNAL_DATABASE_URL");
        }
        if (rawDatabaseUrl == null || rawDatabaseUrl.isBlank()) {
            rawDatabaseUrl = System.getenv("DATABASE_URL");
        }
        if (rawDatabaseUrl == null || rawDatabaseUrl.isBlank()) {
            rawDatabaseUrl = System.getenv("INTERNAL_DATABASE_URL");
        }

        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setDriverClassName("org.postgresql.Driver");

        if (rawDatabaseUrl != null && !rawDatabaseUrl.isBlank()) {
            String trimmedUrl = rawDatabaseUrl.trim();
            log.info("Detected cloud DATABASE_URL from environment.");

            if (trimmedUrl.startsWith("postgres://") || trimmedUrl.startsWith("postgresql://")) {
                try {
                    // Standardize scheme to postgresql:// for URI parsing
                    String normalizedScheme = trimmedUrl.startsWith("postgres://")
                            ? trimmedUrl.replaceFirst("^postgres://", "postgresql://")
                            : trimmedUrl;

                    URI uri = new URI(normalizedScheme);

                    String username = null;
                    String password = null;

                    if (uri.getUserInfo() != null) {
                        String[] userInfoParts = uri.getUserInfo().split(":", 2);
                        username = URLDecoder.decode(userInfoParts[0], StandardCharsets.UTF_8);
                        if (userInfoParts.length > 1) {
                            password = URLDecoder.decode(userInfoParts[1], StandardCharsets.UTF_8);
                        }
                    }

                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath(); // e.g. /cabgo_db
                    String query = uri.getQuery();

                    StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                            .append(host)
                            .append(":")
                            .append(port)
                            .append(path);

                    if (query != null && !query.isBlank()) {
                        jdbcUrl.append("?").append(query);
                    }

                    log.info("Parsed JDBC URL: jdbc:postgresql://{}:{}{}", host, port, path);

                    hikariConfig.setJdbcUrl(jdbcUrl.toString());
                    if (username != null) {
                        hikariConfig.setUsername(username);
                    }
                    if (password != null) {
                        hikariConfig.setPassword(password);
                    }

                } catch (Exception e) {
                    log.error("Failed to parse DATABASE_URL URI: {}. Falling back to raw URL.", e.getMessage());
                    hikariConfig.setJdbcUrl(trimmedUrl.replaceFirst("^postgres://", "jdbc:postgresql://"));
                }
            } else if (trimmedUrl.startsWith("jdbc:postgresql://")) {
                hikariConfig.setJdbcUrl(trimmedUrl);
                hikariConfig.setUsername(fallbackUsername);
                hikariConfig.setPassword(fallbackPassword);
            } else {
                hikariConfig.setJdbcUrl(trimmedUrl);
            }
        } else {
            log.info("No cloud DATABASE_URL detected; using default properties datasource: {}", fallbackUrl);
            hikariConfig.setJdbcUrl(fallbackUrl.isBlank() ? "jdbc:postgresql://localhost:5432/cabgo_db" : fallbackUrl);
            hikariConfig.setUsername(fallbackUsername);
            hikariConfig.setPassword(fallbackPassword);
        }

        // Production-tuned connection pool settings for Render free tier (512MB RAM)
        hikariConfig.setMaximumPoolSize(5);
        hikariConfig.setMinimumIdle(1);
        hikariConfig.setIdleTimeout(300000);
        hikariConfig.setConnectionTimeout(30000);
        hikariConfig.setMaxLifetime(600000);
        hikariConfig.setPoolName("CabGo-Postgres-HikariPool");

        return new HikariDataSource(hikariConfig);
    }
}
