package com.example.pages;

import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class RegistrationPage {

    private final AndroidDriver driver;
    private final WebDriverWait wait;

    @AndroidFindBy(accessibility = "emailField")
    private WebElement emailField;

    @AndroidFindBy(accessibility = "passwordField")
    private WebElement passwordField;

    @AndroidFindBy(accessibility = "registerButton")
    private WebElement registerButton;

    @AndroidFindBy(accessibility = "validationErrorMessage")
    private WebElement validationErrorMessage;

    @AndroidFindBy(accessibility = "errorMessageText")
    private WebElement errorMessageText;

    public RegistrationPage(AndroidDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        PageFactory.initElements(new AppiumFieldDecorator(driver, Duration.ofSeconds(15)), this);
    }

    public void waitForPageToLoad() {
        wait.until(ExpectedConditions.visibilityOf(emailField));
    }

    public boolean isRegistrationPageDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOf(emailField));
            return emailField.isDisplayed() && registerButton.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void enterEmail(String email) {
        wait.until(ExpectedConditions.elementToBeClickable(emailField));
        emailField.clear();
        emailField.sendKeys(email);
    }

    public void enterPassword(String password) {
        wait.until(ExpectedConditions.elementToBeClickable(passwordField));
        passwordField.clear();
        passwordField.sendKeys(password);
    }

    public void clickRegisterButton() {
        wait.until(ExpectedConditions.elementToBeClickable(registerButton));
        registerButton.click();
    }

    public boolean isValidationErrorDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOf(validationErrorMessage));
            return validationErrorMessage.isDisplayed();
        } catch (Exception e) {
            // Fallback: check errorMessageText element
            try {
                wait.until(ExpectedConditions.visibilityOf(errorMessageText));
                return errorMessageText.isDisplayed();
            } catch (Exception ex) {
                return false;
            }
        }
    }

    public String getErrorMessageText() {
        try {
            wait.until(ExpectedConditions.visibilityOf(errorMessageText));
            return errorMessageText.getText();
        } catch (Exception e) {
            try {
                wait.until(ExpectedConditions.visibilityOf(validationErrorMessage));
                return validationErrorMessage.getText();
            } catch (Exception ex) {
                return "";
            }
        }
    }
}
