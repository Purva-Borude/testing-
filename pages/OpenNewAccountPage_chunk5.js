'use strict';

const { By, Select } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class OpenNewAccountPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      accountTypeDropdown: By.id('type'),
      fromAccountDropdown: By.id('fromAccountId'),
      openAccountButton: By.css("input[value='Open New Account']"),
      newAccountId: By.id('newAccountId'),
      confirmationMessage: By.css('#rightPanel h1.title'),
      errorMessage: By.css('#rightPanel .error')
    };
  }

  async open() {
    await this.navigate('/parabank/openaccount.htm');
  }

  async selectAccountType(value) {
    const el = await this.waitForVisible(this.locators.accountTypeDropdown);
    await el.findElement(By.css(`option[value='${value}']`)).click();
  }

  async selectFirstFromAccount() {
    const el = await this.waitForVisible(this.locators.fromAccountDropdown);
    const options = await el.findElements(By.css('option'));
    if (options.length > 0) {
      await options[0].click();
    }
  }

  async clickOpenNewAccount() {
    const btn = await this.waitForClickable(this.locators.openAccountButton);
    const start = Date.now();
    await btn.click();
    return start;
  }

  async getNewAccountId() {
    const el = await this.waitForVisible(this.locators.newAccountId);
    return el.getText();
  }

  async getConfirmationText() {
    const el = await this.waitForVisible(this.locators.confirmationMessage);
    return el.getText();
  }

  async getErrorText() {
    const el = await this.waitForVisible(this.locators.errorMessage);
    return el.getText();
  }
}

module.exports = OpenNewAccountPage;
