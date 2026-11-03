package com.parabank.tests;

import com.parabank.base.BaseTest;
import com.parabank.pages.LoginPage;
import com.parabank.pages.RegistrationPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class NavigateToRegistrationTest extends BaseTest {

    /**
     * Test ID  : 1
     * Title    : Navigate to Registration Page
     * Priority : High
     * Type     : Functional
     *
     * Steps:
     *   1. Given customer lands on PARABANK Login screen
     *   2. When customer clicks on Register Link
     *   3. Then customer lands on Registration page
     *
     * Expected:
     *   - Customer is redirected to registration page
     *   - Registration form is visible
     *   - Page URL contains 'register'
     *   - HTTP status 200 (validated via non-empty page source and no error indicators)
     */
    @Test(description = "TC-1: Navigate to Registration Page from Login screen")
    public void testNavigateToRegistrationPage() {

        // Step 1: Navigate to ParaBank Login screen
        LoginPage loginPage = new LoginPage(driver);
        loginPage.navigateTo(BASE_URL);

        // Positive assertion: Register link is present on Login page
        Assert.assertTrue(
                loginPage.isRegisterLinkVisible(),
                "[POSITIVE] Register link should be visible on the Login page"
        );

        // Negative assertion: Login page URL should NOT contain 'register'
        String loginUrl = loginPage.getCurrentUrl();
        Assert.assertFalse(
                loginUrl.contains("register"),
                "[NEGATIVE] Login page URL should not contain 'register' before navigation. Actual: " + loginUrl
        );

        // Step 2: Click on Register Link
        RegistrationPage registrationPage = loginPage.clickRegisterLink();

        // Step 3: Verify customer lands on Registration page

        // Assertion A1: Page URL contains 'register'
        String currentUrl = registrationPage.getCurrentUrl();
        Assert.assertTrue(
                currentUrl.contains("register"),
                "[A1-POSITIVE] Page URL should contain 'register'. Actual URL: " + currentUrl
        );

        // Assertion A2: Registration form is visible
        Assert.assertTrue(
                registrationPage.isRegistrationFormVisible(),
                "[A2-POSITIVE] Registration form (id='customerForm') should be visible"
        );

        // Assertion A3: Page heading confirms registration page
        Assert.assertTrue(
                registrationPage.isPageTitleVisible(),
                "[A3-POSITIVE] Page title 'Signing up is easy!' should be visible"
        );

        // Assertion A4: Page loaded successfully - non-empty source and no error indicators
        Assert.assertTrue(
                registrationPage.isPageLoaded(),
                "[A4-POSITIVE] Registration page source should be non-empty (HTTP 200 equivalent)"
        );
        Assert.assertTrue(
                registrationPage.hasNoErrorPage(),
                "[A4-POSITIVE] Page should not contain error codes (404/500/Error)"
        );

        // Negative assertion: URL should NOT point back to login page
        Assert.assertFalse(
                currentUrl.endsWith("index.htm"),
                "[NEGATIVE] After clicking Register, URL should not remain on index.htm. Actual: " + currentUrl
        );
    }
}
