using OpenQA.Selenium;
using OpenQA.Selenium.Appium;
using OpenQA.Selenium.Appium.Android;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using System;

namespace ParaBankTests.Pages
{
    public class RegistrationPage
    {
        private readonly AndroidDriver _driver;
        private readonly WebDriverWait _wait;

        // Locators
        private readonly By _firstNameField = By.Id("customer.firstName");
        private readonly By _lastNameField = By.Id("customer.lastName");
        private readonly By _addressField = By.Id("customer.address.street");
        private readonly By _cityField = By.Id("customer.address.city");
        private readonly By _stateField = By.Id("customer.address.state");
        private readonly By _zipCodeField = By.Id("customer.address.zipCode");
        private readonly By _phoneNumberField = By.Id("customer.phoneNumber");
        private readonly By _ssnField = By.Id("customer.ssn");
        private readonly By _usernameField = By.Id("customer.username");
        private readonly By _passwordField = By.Id("customer.password");
        private readonly By _confirmPasswordField = By.Id("repeatedPassword");
        private readonly By _registerButton = By.XPath("//input[@value='Register']");

        public RegistrationPage(AndroidDriver driver)
        {
            _driver = driver;
            _wait = new WebDriverWait(driver, TimeSpan.FromSeconds(15));
        }

        public void WaitForPageLoad()
        {
            _wait.Until(ExpectedConditions.ElementIsVisible(_firstNameField));
        }

        public bool IsFirstNameFieldVisible()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementIsVisible(_firstNameField));
                return element.Displayed;
            }
            catch { return false; }
        }

        public bool IsFirstNameFieldEnabled()
        {
            try
            {
                var element = _driver.FindElement(_firstNameField);
                return element.Enabled;
            }
            catch { return false; }
        }

        public bool IsLastNameFieldVisible()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementIsVisible(_lastNameField));
                return element.Displayed;
            }
            catch { return false; }
        }

        public bool IsLastNameFieldEnabled()
        {
            try
            {
                var element = _driver.FindElement(_lastNameField);
                return element.Enabled;
            }
            catch { return false; }
        }

        public bool IsAddressFieldVisible()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementIsVisible(_addressField));
                return element.Displayed;
            }
            catch { return false; }
        }

        public bool IsAddressFieldEnabled()
        {
            try
            {
                var element = _driver.FindElement(_addressField);
                return element.Enabled;
            }
            catch { return false; }
        }

        public bool IsCityFieldVisible()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementIsVisible(_cityField));
                return element.Displayed;
            }
            catch { return false; }
        }

        public bool IsCityFieldEnabled()
        {
            try
            {
                var element = _driver.FindElement(_cityField);
                return element.Enabled;
            }
            catch { return false; }
        }

        public bool IsStateFieldVisible()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementIsVisible(_stateField));
                return element.Displayed;
            }
            catch { return false; }
        }

        public bool IsStateFieldEnabled()
        {
            try
            {
                var element = _driver.FindElement(_stateField);
                return element.Enabled;
            }
            catch { return false; }
        }

        public bool IsZipCodeFieldVisible()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementIsVisible(_zipCodeField));
                return element.Displayed;
            }
            catch { return false; }
        }

        public bool IsZipCodeFieldEnabled()
        {
            try
            {
                var element = _driver.FindElement(_zipCodeField);
                return element.Enabled;
            }
            catch { return false; }
        }

        public bool IsPhoneNumberFieldVisible()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementIsVisible(_phoneNumberField));
                return element.Displayed;
            }
            catch { return false; }
        }

        public bool IsPhoneNumberFieldEnabled()
        {
            try
            {
                var element = _driver.FindElement(_phoneNumberField);
                return element.Enabled;
            }
            catch { return false; }
        }

        public bool IsSsnFieldVisible()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementIsVisible(_ssnField));
                return element.Displayed;
            }
            catch { return false; }
        }

        public bool IsSsnFieldEnabled()
        {
            try
            {
                var element = _driver.FindElement(_ssnField);
                return element.Enabled;
            }
            catch { return false; }
        }

        public bool IsUsernameFieldVisible()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementIsVisible(_usernameField));
                return element.Displayed;
            }
            catch { return false; }
        }

        public bool IsUsernameFieldEnabled()
        {
            try
            {
                var element = _driver.FindElement(_usernameField);
                return element.Enabled;
            }
            catch { return false; }
        }

        public bool IsPasswordFieldVisible()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementIsVisible(_passwordField));
                return element.Displayed;
            }
            catch { return false; }
        }

        public bool IsPasswordFieldEnabled()
        {
            try
            {
                var element = _driver.FindElement(_passwordField);
                return element.Enabled;
            }
            catch { return false; }
        }

        public bool IsConfirmPasswordFieldVisible()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementIsVisible(_confirmPasswordField));
                return element.Displayed;
            }
            catch { return false; }
        }

        public bool IsConfirmPasswordFieldEnabled()
        {
            try
            {
                var element = _driver.FindElement(_confirmPasswordField);
                return element.Enabled;
            }
            catch { return false; }
        }

        public bool IsRegisterButtonVisible()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementIsVisible(_registerButton));
                return element.Displayed;
            }
            catch { return false; }
        }

        public bool IsRegisterButtonClickable()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementToBeClickable(_registerButton));
                return element != null;
            }
            catch { return false; }
        }
    }
}