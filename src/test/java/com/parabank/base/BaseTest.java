package com.parabank.base;

import com.parabank.utils.DriverManager;
import com.parabank.utils.ScreenshotUtil;
import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public class BaseTest {

    protected static final String BASE_URL = "https://parabank.parasoft.com/parabank/index.htm";
    protected WebDriver driver;

    @BeforeMethod
    public void setUp() {
        driver = DriverManager.getDriver();
        driver.manage().window().maximize();
    }

    @AfterMethod
    public void tearDown(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            ScreenshotUtil.capture(driver, result.getName() + "_FAILURE");
        } else if (result.getStatus() == ITestResult.SUCCESS) {
            ScreenshotUtil.capture(driver, result.getName() + "_SUCCESS");
        }
        DriverManager.quitDriver();
    }
}