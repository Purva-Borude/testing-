package com.example.tests;

import com.example.pages.RegistrationPage;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.remote.MobileCapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.net.MalformedURLException;
import java.net.URL;

public class RegistrationTest {

    private AndroidDriver driver;
    private RegistrationPage registrationPage;

    @BeforeMethod
    public void setUp() throws MalformedURLException {
        DesiredCapabilities capabilities = new DesiredCapabilities();
        capabilities.setCapability(MobileCapabilityType.PLATFORM_NAME, "Android");
        capabilities.setCapability(MobileCapabilityType.AUTOMATION_NAME, "UiAutomator2");
        capabilities.setCapability(MobileCapabilityType.DEVICE_NAME, "Android Emulator");
        capabilities.setCapability("appPackage", "com.example.app");
        capabilities.setCapability("appActivity", ".MainActivity");
        capabilities.setCapability(MobileCapabilityType.NO_RESET, false);

        driver = new AndroidDriver(new URL("http://127.0.0.1:4723/wd/hub"), capabilities);
        registrationPage = new RegistrationPage(driver);
    }

    @Test(description = "TC_001 - Registration with Invalid Details: Verify validation errors are shown for invalid email and password")
    public void testRegistrationWithInvalidDetails() {
        // Given customer is on Registration page
        registrationPage.waitForPageToLoad();
        Assert.assertTrue(registrationPage.isRegistrationPageDisplayed(),
                "Registration page should be displayed");

        // When invalid details are provided (email: 'format', password: 's')
        registrationPage.enterEmail("format");
        registrationPage.enterPassword("s");

        // And clicked on REGISTER button
        registrationPage.clickRegisterButton();

        // Then registration should fail - validation errors should be displayed
        Assert.assertTrue(registrationPage.isValidationErrorDisplayed(),
                "Validation error message should be displayed");

        // User remains on registration page
        Assert.assertTrue(registrationPage.isRegistrationPageDisplayed(),
                "User should remain on the registration page after failed registration");

        // Error messages are displayed
        String errorMessage = registrationPage.getErrorMessageText();
        Assert.assertNotNull(errorMessage, "Error message text should not be null");
        Assert.assertFalse(errorMessage.isEmpty(), "Error message text should not be empty");
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
