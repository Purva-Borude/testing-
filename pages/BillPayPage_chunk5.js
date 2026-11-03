'use strict';

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class BillPayPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
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
      successAmount: By.xpath("//div[@id='rightPanel']//b[2]")
    };
  }

  async open() {
    await this.navigate('/parabank/billpay.htm');
  }

  async fillBillPayForm(data) {
    const fields = [
      [this.locators.payeeNameInput, data.payeeName],
      [this.locators.payeeAddressInput, data.address],
      [this.locators.payeeCityInput, data.city],
      [this.locators.payeeStateInput, data.state],
      [this.locators.payeeZipInput, data.zipCode],
      [this.locators.payeePhoneInput, data.phone],
      [this.locators.payeeAccountInput, data.accountNumber],
      [this.locators.verifyAccountInput, data.accountNumber],
      [this.locators.amountInput, data.amount]
    ];
    for (const [locator, value] of fields) {
      const el = await this.waitForVisible(locator);
      await el.clear();
      await el.sendKeys(value || '');
    }
  }

  async selectFirstFromAccount() {
    const el = await this.waitForVisible(this.locators.fromAccountDropdown);
    const options = await el.findElements(By.css('option'));
    if (options.length > 0) {
      await options[0].click();
    }
  }

  async submitPayment() {
    const btn = await this.waitForClickable(this.locators.sendPaymentButton);
    const start = Date.now();
    await btn.click();
    return start;
  }

  async getConfirmationText() {
    const el = await this.waitForVisible(this.locators.confirmationMessage);
    return el.getText();
  }

  async getSuccessPayeeName() {
    const el = await this.waitForVisible(this.locators.successPayeeName);
    return el.getText();
  }

  async getFieldError(locator) {
    try {
      const el = await this.waitForVisible(locator, 8000);
      return el.getText();
    } catch (e) {
      return null;
    }
  }
}

module.exports = BillPayPage;
