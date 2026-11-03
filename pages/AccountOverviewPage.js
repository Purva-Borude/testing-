'use strict';

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class AccountOverviewPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      accountsTable: By.id('accountTable'),
      accountRows: By.css('#accountTable tbody tr'),
      totalBalance: By.css('#accountTable tfoot tr td:last-child b')
    };
  }

  async open() {
    await this.navigate('/parabank/overview.htm');
  }

  async getAccountNumbers() {
    await this.waitForVisible(this.locators.accountsTable);
    const rows = await this.driver.findElements(this.locators.accountRows);
    const numbers = [];
    for (const row of rows) {
      try {
        const link = await row.findElement(By.css('td a'));
        const text = await link.getText();
        if (text && text.trim()) {
          numbers.push(text.trim());
        }
      } catch (e) { /* skip non-link rows */ }
    }
    return numbers;
  }

  async isAccountTableVisible() {
    try {
      await this.waitForVisible(this.locators.accountsTable, 8000);
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = AccountOverviewPage;
