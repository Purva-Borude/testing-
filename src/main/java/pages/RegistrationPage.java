package pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class RegistrationPage extends BasePage {

    // Locators
    private static final By FIRST_NAME_FIELD     = By.id("firstName");
    private static final By LAST_NAME_FIELD      = By.id("lastName");
    private static final By EMAIL_FIELD          = By.cssSelector("input[type='email']");
    private static final By PASSWORD_FIELD       = By.cssSelector("input[type='password']");
    private static final By CONFIRM_PASSWORD_FIELD = By.id("confirmPassword");
    private static final By REGISTER_BUTTON      = By.xpath(
            "//button[contains(translate(text(),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ'),'REGISTER')]" +
            " | //button[@type='submit']");

    public RegistrationPage(WebDriver driver) {
        super(driver);
    }

    public void navigateTo(String registrationUrl) {
        driver.get(registrationUrl);
    }

    public boolean isRegistrationPageLoaded() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(FIRST_NAME_FIELD));
            return true;
        } catch (TimeoutException e) {
            return false;
        }
    }

    public void enterFirstName(String firstName) {
        WebElement field = waitForElementVisible(FIRST_NAME_FIELD, 15);
        field.clear();
        field.sendKeys(firstName);
    }

    public void enterLastName(String lastName) {
        WebElement field = waitForElementVisible(LAST_NAME_FIELD, 15);
        field.clear();
        field.sendKeys(lastName);
    }

    public void enterEmail(String email) {
        WebElement field = waitForElementVisible(EMAIL_FIELD, 15);
        field.clear();
        field.sendKeys(email);
    }

    public void enterPassword(String password) {
        WebElement field = waitForElementVisible(PASSWORD_FIELD, 15);
        field.clear();
        field.sendKeys(password);
    }

    public void enterConfirmPassword(String confirmPassword) {
        WebElement field = waitForElementVisible(CONFIRM_PASSWORD_FIELD, 15);
        field.clear();
        field.sendKeys(confirmPassword);
    }

    public void clickRegisterButton() {
        WebElement button = waitForElementClickable(REGISTER_BUTTON, 15);
        button.click();
    }

    public void fillRegistrationForm(String firstName, String lastName, String email, String password) {
        enterFirstName(firstName);
        enterLastName(lastName);
        enterEmail(email);
        enterPassword(password);
        enterConfirmPassword(password);
    }

    public boolean isFieldVisible(By locator) {
        try {
            return driver.findElement(locator).isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    public boolean isFirstNameFieldVisible()     { return isFieldVisible(FIRST_NAME_FIELD); }
    public boolean isLastNameFieldVisible()      { return isFieldVisible(LAST_NAME_FIELD); }
    public boolean isEmailFieldVisible()         { return isFieldVisible(EMAIL_FIELD); }
    public boolean isPasswordFieldVisible()      { return isFieldVisible(PASSWORD_FIELD); }
    public boolean isConfirmPasswordFieldVisible(){ return isFieldVisible(CONFIRM_PASSWORD_FIELD); }
    public boolean isRegisterButtonVisible()     { return isFieldVisible(REGISTER_BUTTON); }
}