using OpenQA.Selenium;
using OpenQA.Selenium.Appium;
using OpenQA.Selenium.Appium.Android;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using System;

namespace ParaBankTests.Pages
{
    public class AccountOverviewPage
    {
        private readonly AndroidDriver _driver;
        private readonly WebDriverWait _wait;

        // Locators
        private readonly By _openNewAccountLink = By.XPath("//a[contains(text(),'Open New Account')]");
        private readonly By _navigationMenu = By.Id("leftPanel");

        public AccountOverviewPage(AndroidDriver driver)
        {
            _driver = driver;
            _wait = new WebDriverWait(driver, TimeSpan.FromSeconds(15));
        }

        public void WaitForPageLoad()
        {
            _wait.Until(ExpectedConditions.ElementIsVisible(_navigationMenu));
        }

        public bool IsOpenNewAccountLinkVisible()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementIsVisible(_openNewAccountLink));
                return element.Displayed;
            }
            catch { return false; }
        }

        public bool IsOpenNewAccountLinkClickable()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementToBeClickable(_openNewAccountLink));
                return element != null;
            }
            catch { return false; }
        }

        public bool IsNavigationMenuVisible()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementIsVisible(_navigationMenu));
                return element.Displayed;
            }
            catch { return false; }
        }

        public string GetOpenNewAccountLinkHref()
        {
            try
            {
                var element = _wait.Until(ExpectedConditions.ElementIsVisible(_openNewAccountLink));
                return element.GetAttribute("href") ?? string.Empty;
            }
            catch { return string.Empty; }
        }
    }
}