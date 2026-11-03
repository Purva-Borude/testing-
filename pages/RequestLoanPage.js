'use strict';

const { By, until } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const config = require('../config/config');

const SELECTORS = {
  loanAmountInput: By.id('amount'),
  downPaymentInput: By.id('downPayment'),
  fromAccountDropdown: By.id('fromAccountId'),
  applyNowButton: By.css("input[value='Apply Now']"),
  loanProvider: By.id('loanProviderName'),
  applicationDate: By.id('applicationDate'),
  loanStatus: By.id('loanStatus'),
  newAccountId: By.id('newAccountId'),
  resultsPanel: By.id('requestLoanResult'),
  errorMessage: By.css('#requestLoanError p.error'),
  approvalStatusApproved: By.xpath("//*[@id='loanStatus'][contains(text(),'Approved')]"),
  approvalStatusDenied: By.xpath("//*[@id='loanStatus'][contains(text(),'Denied')]")
};

class RequestLoanPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  async open() {
    await this.navigate('/parabank/requestloan.htm');
  }

  async enterLoanAmount(amount) {
    await this.typeText(SELECTORS.loanAmountInput, amount);
  }

  async enterDownPayment(amount) {
    await this.typeText(SELECTORS.downPaymentInput, amount);
  }

  async selectFromAccount() {
    const { Select } = require('selenium-webdriver/lib/select');
    const el = await this.findElement(SELECTORS.fromAccountDropdown);
    const select = new Select(el);
    await select.selectByIndex(0);
  }

  async clickApplyNow() {
    await this.clickElement(SELECTORS.applyNowButton);
  }

  async applyForLoan(loanAmount, downPayment) {
    await this.enterLoanAmount(loanAmount);
    await this.enterDownPayment(downPayment);
    await this.selectFromAccount();
    const startTime = Date.now();
    await this.clickApplyNow();
    return startTime;
  }

  async getLoanStatus() {
    const el = await this.driver.wait(
      until.elementLocated(SELECTORS.loanStatus),
      config.timeouts.explicitWait
    );
    await this.driver.wait(until.elementIsVisible(el), config.timeouts.explicitWait);
    return el.getText();
  }

  async isResultsPanelDisplayed() {
    return this.isElementPresent(SELECTORS.resultsPanel);
  }

  async isApproved() {
    return this.isElementPresent(SELECTORS.approvalStatusApproved, config.timeouts.explicitWait);
  }

  async isDenied() {
    return this.isElementPresent(SELECTORS.approvalStatusDenied, config.timeouts.explicitWait);
  }

  async getNewAccountId() {
    return this.getText(SELECTORS.newAccountId);
  }
}

module.exports = RequestLoanPage;
