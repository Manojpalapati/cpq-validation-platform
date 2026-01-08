package config;

/**
 * Application constants and configuration values.
 */
public final class Constants {
    private Constants() {
    }

    public static final String FIREBASE_ORDERS_COLLECTION = "orders";
    public static final String DEFAULT_TIMEZONE = "UTC";
    public static final String OKTA_STORAGE_STATE = "auth/okta-storage.json";
    public static final String CPQ_STORAGE_STATE = "auth/cpq.json";
    
    /**
     * Okta SSO login URL.
     * Can be overridden via OKTA_LOGIN_URL environment variable.
     * Default value is a placeholder - update with your actual Okta URL.
     */
    public static String getOktaLoginUrl() {
        return ConfigLoader.getEnvOrDefault(
                "OKTA_LOGIN_URL", 
                "https://your-company.okta.com/app/your-app-id/sso/saml"
        );
    }
}
