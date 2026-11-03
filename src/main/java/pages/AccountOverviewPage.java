package pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class AccountOverviewPage extends BasePage {

    // Locators
    private static final By WELCOME_MESSAGE          = By.xpath("//*[contains(text(),'Welcome')]");
    private static final By ACCOUNT_OVERVIEW_CONTAINER = By.cssSelector(".account-overview");
    private static final By LOGGED_IN_INDICATOR      = By.cssSelector(".logout-btn, .user-profile");
    private static final By LOGOUT_LINK              = By.xpath("//a[contains(text(),'Logout') or contains(text(),'Sign Out')]");

    public AccountOverviewPage(WebDriver driver) {
        super(driver);
    }

    public boolean isAccountOverviewPageLoaded() {
        try {
            wait.until(ExpectedConditions.or(
                ExpectedConditions.urlContains("/account"),
                ExpectedConditions.visibilityOfElementLocated(ACCOUNT_OVERVIEW_CONTAINER)
            ));
            return true;
        } catch (TimeoutException e) {
            return false;
        }
    }

    public boolean isWelcomeMessageDisplayed() {
        try {
            WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(WELCOME_MESSAGE));
            return element.isDisplayed();
        } catch (TimeoutException e) {
            return false;
        }
    }

    public String getWelcomeMessageText() {
        try {
            WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(WELCOME_MESSAGE));
            return element.getText();
        } catch (TimeoutException e) {
            return "";
        }
    }

    public boolean isUserLoggedIn() {
        try {
            wait.until(ExpectedConditions.or(
                ExpectedConditions.visibilityOfElementLocated(LOGGED_IN_INDICATOR),
                ExpectedConditions.visibilityOfElementLocated(LOGOUT_LINK)
            ));
            return true;
        } catch (TimeoutException e) {
            return false;
        }
    }
}