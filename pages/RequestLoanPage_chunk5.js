'use strict';

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class RequestLoanPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      loanAmountInput: By.id('amount'),
      downPaymentInput: By.id('downPayment'),
      fromAccountDropdown: By.id('fromAccountId'),
      applyNowButton: By.css("input[value='Apply Now']"),
      loanStatus: By.id('loanStatus'),
      newAccountId: By.id('newAccountId'),
      resultsPanel: By.id('requestLoanResult'),
      errorMessage: By.css('#requestLoanError p.error'),
      approvedStatus: By.xpath("//*[@id='loanStatus'][contains(text(),'Approved')]"),
      deniedStatus: By.xpath("//*[@id='loanStatus'][contains(text(),'Denied')]")
    };
  }

  async open() {
    await this.navigate('/parabank/requestloan.htm');
  }

  async fillLoanForm(loanAmount, downPayment) {
    const loanEl = await this.waitForVisible(this.locators.loanAmountInput);
    await loanEl.clear();
    await loanEl.sendKeys(loanAmount);

    const downEl = await this.waitForVisible(this.locators.downPaymentInput);
    await downEl.clear();
    await downEl.sendKeys(downPayment);
  }

  async selectFirstFromAccount() {
    const el = await this.waitForVisible(this.locators.fromAccountDropdown);
    const options = await el.findElements(By.css('option'));
    if (options.length > 0) {
      await options[0].click();
    }
  }

  async submitLoanApplication() {
    const btn = await this.waitForClickable(this.locators.applyNowButton);
    const start = Date.now();
    await btn.click();
    return start;
  }

  async getLoanStatus() {
    const el = await this.waitForVisible(this.locators.loanStatus);
    return el.getText();
  }

  async getNewAccountId() {
    const el = await this.waitForVisible(this.locators.newAccountId);
    return el.getText();
  }

  async getErrorMessage() {
    const el = await this.waitForVisible(this.locators.errorMessage);
    return el.getText();
  }

  async isResultsPanelVisible() {
    try {
      await this.waitForVisible(this.locators.resultsPanel, 10000);
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = RequestLoanPage;
