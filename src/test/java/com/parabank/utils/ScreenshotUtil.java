package com.parabank.utils;

import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ScreenshotUtil {

    private static final String SCREENSHOT_DIR = "target/screenshots/";
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");

    private ScreenshotUtil() {
    }

    public static String capture(WebDriver driver, String testName) {
        try {
            Files.createDirectories(Paths.get(SCREENSHOT_DIR));
            String timestamp = LocalDateTime.now().format(FORMATTER);
            String filePath = SCREENSHOT_DIR + testName + "_" + timestamp + ".png";
            File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            Files.copy(screenshot.toPath(), Paths.get(filePath));
            System.out.println("[ScreenshotUtil] Screenshot saved: " + filePath);
            return filePath;
        } catch (IOException e) {
            System.err.println("[ScreenshotUtil] Failed to save screenshot: " + e.getMessage());
            return null;
        }
    }
}