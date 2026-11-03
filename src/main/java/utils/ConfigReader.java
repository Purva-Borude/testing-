package utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigReader {

    private static final Properties properties = new Properties();
    private static final String CONFIG_FILE = "config.properties";

    static {
        try (InputStream input = ConfigReader.class.getClassLoader().getResourceAsStream(CONFIG_FILE)) {
            if (input == null) {
                throw new RuntimeException("Unable to find " + CONFIG_FILE);
            }
            properties.load(input);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load configuration: " + e.getMessage(), e);
        }
    }

    private ConfigReader() {}

    public static String getBaseUrl() {
        return System.getProperty("base.url", properties.getProperty("base.url", "https://example.com"));
    }

    public static String getBrowser() {
        return System.getProperty("browser", properties.getProperty("browser", "chrome"));
    }

    public static int getExplicitWait() {
        return Integer.parseInt(properties.getProperty("explicit.wait.seconds", "15"));
    }

    public static String getScreenshotsDir() {
        return properties.getProperty("screenshots.dir", "test-output/screenshots");
    }

    public static String getReportsDir() {
        return properties.getProperty("reports.dir", "test-output/reports");
    }
}