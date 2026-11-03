'use strict';

const { By } = require('selenium-webdriver');
const { until } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const config = require('../config/config');

const SELECTORS = {
  accountTypeDropdown: By.id('type'),
  fromAccountDropdown: By.id('fromAccountId'),
  openAccountButton: By.css("input[value='Open New Account']"),
  newAccountId: By.id('newAccountId'),
  confirmationMessage: By.css('#rightPanel h1.title'),
  errorMessage: By.css('#rightPanel .error'),
  checkingOption: By.xpath("//option[@value='0']"),
  savingsOption: By.xpath("//option[@value='1']")
};

class OpenNewAccountPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  async open() {
    await this.navigate('/parabank/openaccount.htm');
  }

  async selectAccountType(typeValue) {
    const { Select } = require('selenium-webdriver/lib/select');
    const el = await this.findElement(SELECTORS.accountTypeDropdown);
    const select = new Select(el);
    await select.selectByValue(String(typeValue));
  }

  async selectFromAccount() {
    const { Select } = require('selenium-webdriver/lib/select');
    const el = await this.findElement(SELECTORS.fromAccountDropdown);
    await this.driver.wait(until.elementIsEnabled(el), config.timeouts.explicitWait);
    const select = new Select(el);
    await select.selectByIndex(0);
  }

  async clickOpenNewAccount() {
    await this.clickElement(SELECTORS.openAccountButton);
  }

  async openAccount(typeValue = '0') {
    await this.selectAccountType(typeValue);
    await this.selectFromAccount();
    const startTime = Date.now();
    await this.clickOpenNewAccount();
    return startTime;
  }

  async getNewAccountId() {
    const el = await this.driver.wait(
      until.elementLocated(SELECTORS.newAccountId),
      config.timeouts.explicitWait
    );
    await this.driver.wait(until.elementIsVisible(el), config.timeouts.explicitWait);
    return el.getText();
  }

  async getConfirmationText() {
    return this.getText(SELECTORS.confirmationMessage);
  }

  async isConfirmationDisplayed() {
    return this.isElementPresent(SELECTORS.confirmationMessage);
  }

  async isErrorDisplayed() {
    return this.isElementPresent(SELECTORS.errorMessage);
  }
}

module.exports = OpenNewAccountPage;
