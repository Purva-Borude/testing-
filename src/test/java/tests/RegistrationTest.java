package tests;

import base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;
import pages.AccountOverviewPage;
import pages.RegistrationPage;
import utils.TestDataReader;

public class RegistrationTest extends BaseTest {

    // -------------------------------------------------------------------------
    // TC-1: Successful Customer Registration (Positive)
    // -------------------------------------------------------------------------
    @Test(
        priority = 1,
        description = "TC-1: Successful Customer Registration - positive flow"
    )
    public void testSuccessfulCustomerRegistration() {
        String firstName   = TestDataReader.getValidFirstName();
        String lastName    = TestDataReader.getValidLastName();
        String email       = TestDataReader.generateUniqueEmail();
        String password    = TestDataReader.getValidPassword();

        // Step 1: Navigate to Registration page
        RegistrationPage registrationPage = new RegistrationPage(driver);
        registrationPage.navigateTo(baseUrl + "/register");

        // Positive assertion: Registration page has loaded
        Assert.assertTrue(
            registrationPage.isRegistrationPageLoaded(),
            "Registration page should be loaded with the first-name field visible"
        );

        // Positive assertion: All form fields are present
        Assert.assertTrue(registrationPage.isFirstNameFieldVisible(),      "First name field should be visible");
        Assert.assertTrue(registrationPage.isLastNameFieldVisible(),       "Last name field should be visible");
        Assert.assertTrue(registrationPage.isEmailFieldVisible(),          "Email field should be visible");
        Assert.assertTrue(registrationPage.isPasswordFieldVisible(),       "Password field should be visible");
        Assert.assertTrue(registrationPage.isConfirmPasswordFieldVisible(),"Confirm password field should be visible");
        Assert.assertTrue(registrationPage.isRegisterButtonVisible(),      "Register button should be visible");

        // Step 2: Fill in all valid details
        registrationPage.fillRegistrationForm(firstName, lastName, email, password);

        // Step 3: Click REGISTER button
        registrationPage.clickRegisterButton();

        // Step 4: Verify account creation and automatic login
        AccountOverviewPage accountOverviewPage = new AccountOverviewPage(driver);

        // Positive assertion: Redirected to account overview page
        Assert.assertTrue(
            accountOverviewPage.isAccountOverviewPageLoaded(),
            "User should be redirected to the account overview page after registration"
        );

        // Positive assertion: URL contains /account
        String currentUrl = accountOverviewPage.getCurrentUrl();
        Assert.assertTrue(
            currentUrl.contains("/account"),
            "Current URL should contain '/account' but was: " + currentUrl
        );

        // Positive assertion: Welcome message is displayed
        Assert.assertTrue(
            accountOverviewPage.isWelcomeMessageDisplayed(),
            "A welcome message should be displayed after successful registration"
        );

        // Positive assertion: User is automatically logged in
        Assert.assertTrue(
            accountOverviewPage.isUserLoggedIn(),
            "User should be automatically logged in after registration"
        );

        // Positive assertion: HTTP 200 for account overview page
        int httpStatus = accountOverviewPage.getHttpStatusCode(currentUrl);
        Assert.assertEquals(
            httpStatus,
            200,
            "HTTP status code for account overview page should be 200 but was: " + httpStatus
        );

        System.out.println("[TC-1] PASSED: User '" + email + "' registered successfully.");
        System.out.println("[TC-1] Welcome message: " + accountOverviewPage.getWelcomeMessageText());
    }

    // -------------------------------------------------------------------------
    // TC-2: Registration with mismatched passwords (Negative)
    // -------------------------------------------------------------------------
    @Test(
        priority = 2,
        description = "TC-2: Registration with mismatched passwords - negative flow"
    )
    public void testRegistrationWithMismatchedPasswords() {
        String firstName   = TestDataReader.getValidFirstName();
        String lastName    = TestDataReader.getValidLastName();
        String email       = TestDataReader.generateUniqueEmail();
        String password    = TestDataReader.getValidPassword();
        String wrongConfirm = TestDataReader.getMismatchedConfirmPassword();

        RegistrationPage registrationPage = new RegistrationPage(driver);
        registrationPage.navigateTo(baseUrl + "/register");

        Assert.assertTrue(
            registrationPage.isRegistrationPageLoaded(),
            "Registration page should be loaded"
        );

        // Fill form with mismatched confirm password
        registrationPage.enterFirstName(firstName);
        registrationPage.enterLastName(lastName);
        registrationPage.enterEmail(email);
        registrationPage.enterPassword(password);
        registrationPage.enterConfirmPassword(wrongConfirm);
        registrationPage.clickRegisterButton();

        // Negative assertion: User should NOT be redirected to account overview
        String currentUrl = driver.getCurrentUrl();
        Assert.assertFalse(
            currentUrl.contains("/account"),
            "User should NOT be redirected to /account with mismatched passwords; current URL: " + currentUrl
        );

        // Negative assertion: Page title should not indicate successful login
        String pageTitle = driver.getTitle();
        Assert.assertFalse(
            pageTitle.toLowerCase().contains("account overview"),
            "Page title should not be 'account overview' after mismatched password submission"
        );

        System.out.println("[TC-2] PASSED (Negative): Mismatched passwords correctly rejected. URL: " + currentUrl);
    }

    // -------------------------------------------------------------------------
    // TC-3: Registration with empty required fields (Negative)
    // -------------------------------------------------------------------------
    @Test(
        priority = 3,
        description = "TC-3: Registration with empty required fields - negative flow"
    )
    public void testRegistrationWithEmptyFields() {
        RegistrationPage registrationPage = new RegistrationPage(driver);
        registrationPage.navigateTo(baseUrl + "/register");

        Assert.assertTrue(
            registrationPage.isRegistrationPageLoaded(),
            "Registration page should be loaded"
        );

        // Submit the form without filling any fields
        registrationPage.clickRegisterButton();

        // Negative assertion: User should remain on registration page
        String currentUrl = driver.getCurrentUrl();
        Assert.assertFalse(
            currentUrl.contains("/account"),
            "User should NOT be redirected to /account when submitting empty form; current URL: " + currentUrl
        );

        System.out.println("[TC-3] PASSED (Negative): Empty form submission correctly rejected. URL: " + currentUrl);
    }

    // -------------------------------------------------------------------------
    // TC-4: Registration with invalid email format (Negative)
    // -------------------------------------------------------------------------
    @Test(
        priority = 4,
        description = "TC-4: Registration with invalid email format - negative flow"
    )
    public void testRegistrationWithInvalidEmail() {
        String firstName = TestDataReader.getValidFirstName();
        String lastName  = TestDataReader.getValidLastName();
        String password  = TestDataReader.getValidPassword();
        String invalidEmail = TestDataReader.getInvalidEmail();

        RegistrationPage registrationPage = new RegistrationPage(driver);
        registrationPage.navigateTo(baseUrl + "/register");

        Assert.assertTrue(
            registrationPage.isRegistrationPageLoaded(),
            "Registration page should be loaded"
        );

        registrationPage.fillRegistrationForm(firstName, lastName, invalidEmail, password);
        registrationPage.clickRegisterButton();

        // Negative assertion: User should NOT reach the account overview page
        String currentUrl = driver.getCurrentUrl();
        Assert.assertFalse(
            currentUrl.contains("/account"),
            "User should NOT be redirected to /account with an invalid email; current URL: " + currentUrl
        );

        System.out.println("[TC-4] PASSED (Negative): Invalid email correctly rejected. URL: " + currentUrl);
    }
}