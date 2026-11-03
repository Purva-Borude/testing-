using NUnit.Framework;
using OpenQA.Selenium.Appium;
using OpenQA.Selenium.Appium.Android;
using OpenQA.Selenium.Appium.Enums;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using ParaBankTests.Pages;
using System;

namespace ParaBankTests.Tests
{
    [TestFixture]
    public class ParaBankTests
    {
        private AndroidDriver _driver;
        private const string AppiumServerUrl = "http://127.0.0.1:4723";
        private const string AppPackage = "com.parabank.parasoft";
        private const string AppActivity = "com.parabank.parasoft.MainActivity";

        // Test data
        private const string ValidUsername = "john";
        private const string ValidPassword = "demo";

        [SetUp]
        public void SetUp()
        {
            var options = new AppiumOptions();
            options.PlatformName = "Android";
            options.AutomationName = "UiAutomator2";
            options.App = AppPackage;
            options.AddAdditionalAppiumOption(MobileCapabilityType.AppPackage, AppPackage);
            options.AddAdditionalAppiumOption(MobileCapabilityType.AppActivity, AppActivity);
            options.AddAdditionalAppiumOption(MobileCapabilityType.NoReset, false);
            options.AddAdditionalAppiumOption(MobileCapabilityType.FullReset, false);
            options.AddAdditionalAppiumOption("autoGrantPermissions", true);

            _driver = new AndroidDriver(new Uri(AppiumServerUrl), options, TimeSpan.FromSeconds(60));
            _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(5);
        }

        [TearDown]
        public void TearDown()
        {
            _driver?.Quit();
        }

        /// <summary>
        /// TC_001 - Registration Form Field Validation
        /// Verify that the Registration page contains all required form fields and the REGISTER button
        /// </summary>
        [Test]
        [Category("high")]
        [Category("functional")]
        [Description("Verify that the Registration page contains all required form fields and the REGISTER button")]
        public void TC_001_RegistrationFormFieldValidation()
        {
            // Step 1: Navigate to Registration page
            // The app starts on the home/login page; navigate to registration
            var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(15));

            // Tap the registration / sign-up link (common label variations)
            try
            {
                var registerLink = wait.Until(ExpectedConditions.ElementToBeClickable(
                    OpenQA.Selenium.By.XPath(
                        "//*[contains(@text,'Register') or contains(@content-desc,'Register') " +
                        "or contains(@text,'Sign Up') or contains(@content-desc,'Sign Up')]"
                    )
                ));
                registerLink.Click();
            }
            catch
            {
                // Fallback: try accessibility id
                var registerLink = _driver.FindElement(
                    OpenQA.Selenium.By.XPath("//*[@class='android.widget.TextView' and @text='Register']"));
                registerLink.Click();
            }

            // Step 2: Instantiate the RegistrationPage and wait for it to load
            var registrationPage = new RegistrationPage(_driver);
            registrationPage.WaitForPageLoad();

            // Step 3: Verify all 11 form fields are visible and enabled

            // First Name
            Assert.That(registrationPage.IsFirstNameFieldVisible(),
                Is.True, "First Name field should be visible");
            Assert.That(registrationPage.IsFirstNameFieldEnabled(),
                Is.True, "First Name field should be enabled");

            // Last Name
            Assert.That(registrationPage.IsLastNameFieldVisible(),
                Is.True, "Last Name field should be visible");
            Assert.That(registrationPage.IsLastNameFieldEnabled(),
                Is.True, "Last Name field should be enabled");

            // Address
            Assert.That(registrationPage.IsAddressFieldVisible(),
                Is.True, "Address field should be visible");
            Assert.That(registrationPage.IsAddressFieldEnabled(),
                Is.True, "Address field should be enabled");

            // City
            Assert.That(registrationPage.IsCityFieldVisible(),
                Is.True, "City field should be visible");
            Assert.That(registrationPage.IsCityFieldEnabled(),
                Is.True, "City field should be enabled");

            // State
            Assert.That(registrationPage.IsStateFieldVisible(),
                Is.True, "State field should be visible");
            Assert.That(registrationPage.IsStateFieldEnabled(),
                Is.True, "State field should be enabled");

            // Zip Code
            Assert.That(registrationPage.IsZipCodeFieldVisible(),
                Is.True, "Zip Code field should be visible");
            Assert.That(registrationPage.IsZipCodeFieldEnabled(),
                Is.True, "Zip Code field should be enabled");

            // Phone Number
            Assert.That(registrationPage.IsPhoneNumberFieldVisible(),
                Is.True, "Phone Number field should be visible");
            Assert.That(registrationPage.IsPhoneNumberFieldEnabled(),
                Is.True, "Phone Number field should be enabled");

            // SSN
            Assert.That(registrationPage.IsSsnFieldVisible(),
                Is.True, "SSN field should be visible");
            Assert.That(registrationPage.IsSsnFieldEnabled(),
                Is.True, "SSN field should be enabled");

            // Username
            Assert.That(registrationPage.IsUsernameFieldVisible(),
                Is.True, "Username field should be visible");
            Assert.That(registrationPage.IsUsernameFieldEnabled(),
                Is.True, "Username field should be enabled");

            // Password
            Assert.That(registrationPage.IsPasswordFieldVisible(),
                Is.True, "Password field should be visible");
            Assert.That(registrationPage.IsPasswordFieldEnabled(),
                Is.True, "Password field should be enabled");

            // Confirm Password
            Assert.That(registrationPage.IsConfirmPasswordFieldVisible(),
                Is.True, "Confirm Password field should be visible");
            Assert.That(registrationPage.IsConfirmPasswordFieldEnabled(),
                Is.True, "Confirm Password field should be enabled");

            // Step 4: Verify REGISTER button is present and clickable
            Assert.That(registrationPage.IsRegisterButtonVisible(),
                Is.True, "REGISTER button should be present and visible");
            Assert.That(registrationPage.IsRegisterButtonClickable(),
                Is.True, "REGISTER button should be clickable");
        }

        /// <summary>
        /// TC_002 - Open New Account Link Availability
        /// Verify that the Open New Account link is available and clickable after customer logs in
        /// </summary>
        [Test]
        [Category("medium")]
        [Category("functional")]
        [Description("Verify that the Open New Account link is available and clickable after customer logs into ParaBank")]
        public void TC_002_OpenNewAccountLinkAvailability()
        {
            // Step 1: Log in as a customer
            var loginPage = new LoginPage(_driver);
            loginPage.WaitForPageLoad();
            loginPage.Login(ValidUsername, ValidPassword);

            // Step 2: Wait for AccountOverview page to load
            var accountOverviewPage = new AccountOverviewPage(_driver);
            accountOverviewPage.WaitForPageLoad();

            // Step 3: Verify Open New Account link is visible in the navigation menu
            Assert.That(accountOverviewPage.IsNavigationMenuVisible(),
                Is.True, "Navigation menu (leftPanel) should be visible");

            Assert.That(accountOverviewPage.IsOpenNewAccountLinkVisible(),
                Is.True, "Open New Account link should be visible in navigation menu");

            // Verify link is clickable
            Assert.That(accountOverviewPage.IsOpenNewAccountLinkClickable(),
                Is.True, "Open New Account link should be clickable");

            // Verify proper href attribute is set
            var href = accountOverviewPage.GetOpenNewAccountLinkHref();
            Assert.That(href, Is.Not.Null.And.Not.Empty,
                "Open New Account link should have a proper href attribute set");
        }
    }
}
