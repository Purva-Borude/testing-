package utils;

import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ScreenshotUtils {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss_SSS");

    private ScreenshotUtils() {}

    public static String captureScreenshot(WebDriver driver, String testName, String status) {
        String screenshotsDir = ConfigReader.getScreenshotsDir();
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String fileName = testName + "_" + status + "_" + timestamp + ".png";
        Path destPath = Paths.get(screenshotsDir, fileName);

        try {
            Files.createDirectories(destPath.getParent());
            byte[] screenshotBytes = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
            Files.write(destPath, screenshotBytes);
            System.out.println("[Screenshot] Saved: " + destPath.toAbsolutePath());
            return destPath.toAbsolutePath().toString();
        } catch (IOException e) {
            System.err.println("[Screenshot] Failed to save screenshot: " + e.getMessage());
            return "";
        }
    }
}