'use strict';

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

const SELECTORS = {
  openAccountLink: By.linkText('Open New Account'),
  accountsOverviewLink: By.linkText('Accounts Overview'),
  transferFundsLink: By.linkText('Transfer Funds'),
  billPayLink: By.linkText('Bill Pay'),
  findTransactionsLink: By.linkText('Find Transactions'),
  updateContactLink: By.linkText('Update Contact Info'),
  requestLoanLink: By.linkText('Request Loan'),
  logoutLink: By.linkText('Log Out'),
  maintenanceBanner: By.css('#maintenanceBanner'),
  notificationBanner: By.css('.notification-banner')
};

class NavigationMenuPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  async navigateToBillPay() {
    await this.clickElement(SELECTORS.billPayLink);
  }

  async navigateToOpenNewAccount() {
    await this.clickElement(SELECTORS.openAccountLink);
  }

  async navigateToRequestLoan() {
    await this.clickElement(SELECTORS.requestLoanLink);
  }

  async navigateToAccountOverview() {
    await this.clickElement(SELECTORS.accountsOverviewLink);
  }

  async logout() {
    await this.clickElement(SELECTORS.logoutLink);
  }

  async isMaintenanceBannerPresent(timeout = 5000) {
    return this.isElementPresent(SELECTORS.maintenanceBanner, timeout);
  }

  async isNotificationBannerPresent(timeout = 5000) {
    return this.isElementPresent(SELECTORS.notificationBanner, timeout);
  }

  async getMaintenanceBannerText() {
    return this.getText(SELECTORS.maintenanceBanner);
  }

  async getNotificationBannerText() {
    return this.getText(SELECTORS.notificationBanner);
  }
}

module.exports = NavigationMenuPage;
