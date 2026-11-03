'use strict';

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

const SELECTORS = {
  accountsTable: By.id('accountTable'),
  accountRows: By.css('#accountTable tbody tr'),
  accountLink: By.css('#accountTable tbody tr td a'),
  welcomeMessage: By.css('#rightPanel p.smallText'),
  servicesMenu: By.css('#leftPanel ul.services')
};

class DashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  async open() {
    await this.navigate('/parabank/overview.htm');
  }

  async isAccountsTableVisible() {
    return this.isElementPresent(SELECTORS.accountsTable);
  }

  async getWelcomeText() {
    return this.getText(SELECTORS.welcomeMessage);
  }

  async isLoggedIn() {
    const url = await this.getCurrentUrl();
    return url.includes('overview.htm');
  }
}

module.exports = DashboardPage;
