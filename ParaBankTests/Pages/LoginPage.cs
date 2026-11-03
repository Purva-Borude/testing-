using OpenQA.Selenium;
using OpenQA.Selenium.Appium;
using OpenQA.Selenium.Appium.Android;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using System;

namespace ParaBankTests.Pages
{
    public class LoginPage
    {
        private readonly AndroidDriver _driver;
        private readonly WebDriverWait _wait;

        // Locators
        private readonly By _usernameField = By.Id("username");
        private readonly By _passwordField = By.Id("password");
        private readonly By _loginButton = By.XPath("//input[@value='Log In']");

        public LoginPage(AndroidDriver driver)
        {
            _driver = driver;
            _wait = new WebDriverWait(driver, TimeSpan.FromSeconds(15));
        }

        public void WaitForPageLoad()
        {
            _wait.Until(ExpectedConditions.ElementIsVisible(_usernameField));
        }

        public void EnterUsername(string username)
        {
            var element = _wait.Until(ExpectedConditions.ElementIsVisible(_usernameField));
            element.Clear();
            element.SendKeys(username);
        }

        public void EnterPassword(string password)
        {
            var element = _wait.Until(ExpectedConditions.ElementIsVisible(_passwordField));
            element.Clear();
            element.SendKeys(password);
        }

        public void ClickLoginButton()
        {
            var element = _wait.Until(ExpectedConditions.ElementToBeClickable(_loginButton));
            element.Click();
        }

        public void Login(string username, string password)
        {
            WaitForPageLoad();
            EnterUsername(username);
            EnterPassword(password);
            ClickLoginButton();
        }
    }
}