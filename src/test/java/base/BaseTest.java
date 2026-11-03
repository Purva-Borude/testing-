package base;

import listeners.ExtentReportListener;
import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import utils.ConfigReader;
import utils.DriverFactory;
import utils.ScreenshotUtils;

import java.lang.reflect.Method;

public abstract class BaseTest {

    protected WebDriver driver;
    protected String baseUrl;

    @BeforeMethod(alwaysRun = true)
    public void setUp(Method method) {
        baseUrl = ConfigReader.getBaseUrl();
        driver = DriverFactory.createDriver(ConfigReader.getBrowser());
        driver.manage().window().maximize();
        System.out.println("[Setup] Browser started for test: " + method.getName());
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown(ITestResult result) {
        String testName = result.getMethod().getMethodName();
        if (result.getStatus() == ITestResult.FAILURE) {
            String screenshotPath = ScreenshotUtils.captureScreenshot(driver, testName, "FAILURE");
            System.out.println("[TearDown] Test FAILED - screenshot: " + screenshotPath);
        } else if (result.getStatus() == ITestResult.SUCCESS) {
            String screenshotPath = ScreenshotUtils.captureScreenshot(driver, testName, "SUCCESS");
            System.out.println("[TearDown] Test PASSED - screenshot: " + screenshotPath);
        }
        DriverFactory.quitDriver();
        System.out.println("[TearDown] Browser closed for test: " + testName);
    }
}