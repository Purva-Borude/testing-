'use strict';

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const config = require('../config/config');

class RegistrationPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      firstNameInput: By.name('customer.firstName'),
      lastNameInput: By.name('customer.lastName'),
      addressInput: By.name('customer.address.street'),
      cityInput: By.name('customer.address.city'),
      stateInput: By.name('customer.address.state'),
      zipCodeInput: By.name('customer.address.zipCode'),
      phoneInput: By.name('customer.phoneNumber'),
      ssnInput: By.name('customer.ssn'),
      usernameInput: By.name('customer.username'),
      passwordInput: By.name('customer.password'),
      confirmPasswordInput: By.name('repeatedPassword'),
      registerButton: By.xpath("//input[@value='Register']"),
      firstNameError: By.id('customer.firstName.errors'),
      lastNameError: By.id('customer.lastName.errors'),
      addressError: By.id('customer.address.street.errors'),
      cityError: By.id('customer.address.city.errors'),
      stateError: By.id('customer.address.state.errors'),
      zipCodeError: By.id('customer.address.zipCode.errors'),
      ssnError: By.id('customer.ssn.errors'),
      usernameError: By.id('customer.username.errors'),
      passwordError: By.id('customer.password.errors'),
      confirmPasswordError: By.id('repeatedPassword.errors'),
      successHeader: By.css('#rightPanel h1.title'),
      errorMessage: By.css('#rightPanel .error')
    };
  }

  async open() {
    await this.navigate(config.registerUrl);
  }

  async fillRegistrationForm(data) {
    const fields = [
      [this.locators.firstNameInput, data.firstName],
      [this.locators.lastNameInput, data.lastName],
      [this.locators.addressInput, data.address],
      [this.locators.cityInput, data.city],
      [this.locators.stateInput, data.state],
      [this.locators.zipCodeInput, data.zipCode],
      [this.locators.phoneInput, data.phone],
      [this.locators.ssnInput, data.ssn],
      [this.locators.usernameInput, data.username],
      [this.locators.passwordInput, data.password],
      [this.locators.confirmPasswordInput, data.confirmPassword]
    ];
    for (const [locator, value] of fields) {
      const el = await this.waitForVisible(locator);
      await el.clear();
      await el.sendKeys(value || '');
    }
  }

  async submitRegistrationForm() {
    const btn = await this.waitForClickable(this.locators.registerButton);
    await btn.click();
  }

  async getSuccessHeaderText() {
    const el = await this.waitForVisible(this.locators.successHeader);
    return el.getText();
  }

  async getErrorMessageText() {
    const el = await this.waitForVisible(this.locators.errorMessage);
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

  async getSsnFieldType() {
    const el = await this.waitForVisible(this.locators.ssnInput);
    return el.getAttribute('type');
  }
}

module.exports = RegistrationPage;
