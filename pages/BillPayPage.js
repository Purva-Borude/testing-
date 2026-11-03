'use strict';

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

const SELECTORS = {
  payeeNameInput: By.name('payee.name'),
  payeeAddressInput: By.name('payee.address.street'),
  payeeCityInput: By.name('payee.address.city'),
  payeeStateInput: By.name('payee.address.state'),
  payeeZipInput: By.name('payee.address.zipCode'),
  payeePhoneInput: By.name('payee.phoneNumber'),
  payeeAccountInput: By.name('payee.accountNumber'),
  verifyAccountInput: By.name('verifyAccount'),
  amountInput: By.name('amount'),
  fromAccountDropdown: By.name('fromAccountId'),
  sendPaymentButton: By.css("input[value='Send Payment']"),
  confirmationMessage: By.css('#rightPanel h1.title'),
  payeeNameError: By.id('validationModel-name'),
  addressError: By.id('validationModel-address'),
  cityError: By.id('validationModel-city'),
  stateError: By.id('validationModel-state'),
  zipError: By.id('validationModel-zipCode'),
  phoneError: By.id('validationModel-phoneNumber'),
  accountError: By.id('validationModel-number'),
  amountError: By.id('validationModel-amount'),
  successPayeeName: By.xpath("//div[@id='rightPanel']//b[1]"),
  successAmount: By.xpath("//div[@id='rightPanel']//b[2]"),
  successAccount: By.xpath("//div[@id='rightPanel']//b[3]")
};

class BillPayPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  async open() {
    await this.navigate('/parabank/billpay.htm');
  }

  async fillBillPayForm(payeeData) {
    await this.typeText(SELECTORS.payeeNameInput, payeeData.payeeName);
    await this.typeText(SELECTORS.payeeAddressInput, payeeData.address);
    await this.typeText(SELECTORS.payeeCityInput, payeeData.city);
    await this.typeText(SELECTORS.payeeStateInput, payeeData.state);
    await this.typeText(SELECTORS.payeeZipInput, payeeData.zipCode);
    await this.typeText(SELECTORS.payeePhoneInput, payeeData.phone);
    await this.typeText(SELECTORS.payeeAccountInput, payeeData.accountNumber);
    await this.typeText(SELECTORS.verifyAccountInput, payeeData.accountNumber);
    await this.typeText(SELECTORS.amountInput, payeeData.amount);
  }

  async selectFromAccount(accountId) {
    const { Select } = require('selenium-webdriver/lib/select');
    const el = await this.findElement(SELECTORS.fromAccountDropdown);
    const select = new Select(el);
    await select.selectByIndex(0);
  }

  async clickSendPayment() {
    await this.clickElement(SELECTORS.sendPaymentButton);
  }

  async submitPayment(payeeData) {
    await this.fillBillPayForm(payeeData);
    await this.selectFromAccount();
    const startTime = Date.now();
    await this.clickSendPayment();
    return startTime;
  }

  async getConfirmationText() {
    return this.getText(SELECTORS.confirmationMessage);
  }

  async isConfirmationDisplayed() {
    return this.isElementPresent(SELECTORS.confirmationMessage);
  }

  async getSuccessPayeeName() {
    return this.getText(SELECTORS.successPayeeName);
  }

  async getSuccessAmount() {
    return this.getText(SELECTORS.successAmount);
  }
}

module.exports = BillPayPage;
