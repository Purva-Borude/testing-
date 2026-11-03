'use strict';

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const config = require('../config/config');

class DashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      accountsTable: By.id('accountTable'),
      accountRows: By.css('#accountTable tbody tr'),
      accountLink: By.css('#accountTable tbody tr td a'),
      welcomeMessage: By.css('#rightPanel p.smallText'),
      openNewAccountLink: By.linkText('Open New Account'),
      accountsOverviewLink: By.linkText('Accounts Overview'),
      transferFundsLink: By.linkText('Transfer Funds'),
      billPayLink: By.linkText('Bill Pay'),
      requestLoanLink: By.linkText('Request Loan'),
      logoutLink: By.linkText('Log Out')
    };
  }

  async open() {
    await this.navigate(config.overviewUrl);
  }

  async isLoggedIn() {
    try {
      await this.waitForVisible(this.locators.accountsTable, 8000);
      return true;
    } catch (e) {
      return false;
    }
  }

  async getAccountNumbers() {
    const rows = await this.driver.findElements(this.locators.accountRows);
    const numbers = [];
    for (const row of rows) {
      try {
        const link = await row.findElement(By.css('td a'));
        numbers.push(await link.getText());
      } catch (e) { /* skip totals row */ }
    }
    return numbers;
  }

  async navigateTo(linkLocator) {
    const link = await this.waitForClickable(linkLocator);
    await link.click();
  }

  async navigateToBillPay() {
    await this.navigateTo(this.locators.billPayLink);
  }

  async navigateToOpenNewAccount() {
    await this.navigateTo(this.locators.openNewAccountLink);
  }

  async navigateToRequestLoan() {
    await this.navigateTo(this.locators.requestLoanLink);
  }

  async logout() {
    const logoutEl = await this.waitForClickable(this.locators.logoutLink);
    await logoutEl.click();
  }
}

module.exports = DashboardPage;
