package com.parabank.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class RegistrationPage {

    private static final Duration EXPLICIT_WAIT = Duration.ofSeconds(15);

    private final WebDriver driver;
    private final WebDriverWait wait;

    // Locators
    private final By registrationForm = By.cssSelector("form[id='customerForm']");
    private final By pageTitle = By.xpath("//h1[contains(text(),'Signing up is easy!')]");
    private final By firstNameInput = By.id("customer.firstName");

    public RegistrationPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, EXPLICIT_WAIT);
    }

    public boolean isRegistrationFormVisible() {
        try {
            WebElement form = wait.until(ExpectedConditions.visibilityOfElementLocated(registrationForm));
            return form.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isPageTitleVisible() {
        try {
            WebElement title = wait.until(ExpectedConditions.visibilityOfElementLocated(pageTitle));
            return title.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    public boolean isPageLoaded() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(registrationForm));
            String pageSource = driver.getPageSource();
            return pageSource != null && !pageSource.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean hasNoErrorPage() {
        String pageSource = driver.getPageSource();
        return pageSource != null
                && !pageSource.contains("404")
                && !pageSource.contains("500")
                && !pageSource.contains("Error");
    }
}