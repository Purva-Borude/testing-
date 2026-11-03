package utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.time.Instant;

public class TestDataReader {

    private static final String TEST_DATA_FILE = "testdata/registration_test_data.json";
    private static JsonNode rootNode;

    static {
        try (InputStream is = TestDataReader.class.getClassLoader().getResourceAsStream(TEST_DATA_FILE)) {
            if (is == null) {
                throw new RuntimeException("Test data file not found: " + TEST_DATA_FILE);
            }
            rootNode = new ObjectMapper().readTree(is);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load test data: " + e.getMessage(), e);
        }
    }

    private TestDataReader() {}

    public static String getValidFirstName() {
        return rootNode.path("valid_registration").path("firstName").asText("John");
    }

    public static String getValidLastName() {
        return rootNode.path("valid_registration").path("lastName").asText("Doe");
    }

    public static String getValidPassword() {
        return rootNode.path("valid_registration").path("password").asText("123");
    }

    public static String generateUniqueEmail() {
        String prefix = rootNode.path("valid_registration").path("emailPrefix").asText("john.doe");
        long timestamp = Instant.now().toEpochMilli();
        return prefix + "+" + timestamp + "@example.com";
    }

    public static String getInvalidEmail() {
        return rootNode.path("invalid_registration").path("email").asText("invalid-email");
    }

    public static String getMismatchedConfirmPassword() {
        return rootNode.path("invalid_registration").path("confirmPassword").asText("456");
    }
}