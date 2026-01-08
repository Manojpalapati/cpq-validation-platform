package config;

import java.util.Optional;

/**
 * Simple environment-backed configuration loader.
 */
public final class ConfigLoader {
    private ConfigLoader() {
    }

    public static String getEnv(String key) {
        return Optional.ofNullable(System.getenv(key))
                .filter(v -> !v.isBlank())
                .orElseThrow(() -> new IllegalStateException("Missing required env var: " + key));
    }

    public static String getEnvOrDefault(String key, String fallback) {
        return Optional.ofNullable(System.getenv(key)).filter(v -> !v.isBlank()).orElse(fallback);
    }
}
