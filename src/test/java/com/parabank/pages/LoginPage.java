package com.parabank.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginPage {

    private static final Duration EXPLICIT_WAIT = Duration.ofSeconds(15);

    private final WebDriver driver;
    private final WebDriverWait wait;

    // Locators
    private final By registerLink = By.linkText("Register");
    private final By usernameInput = By.name("username");
    private final By passwordInput = By.name("password");
    private final By loginButton = By.cssSelector("input[value='Log In']");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, EXPLICIT_WAIT);
    }

    public LoginPage navigateTo(String baseUrl) {
        driver.get(baseUrl);
        wait.until(ExpectedConditions.visibilityOfElementLocated(registerLink));
        return this;
    }

    public RegistrationPage clickRegisterLink() {
        WebElement link = wait.until(ExpectedConditions.elementToBeClickable(registerLink));
        link.click();
        return new RegistrationPage(driver);
    }

    public boolean isRegisterLinkVisible() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(registerLink));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
}