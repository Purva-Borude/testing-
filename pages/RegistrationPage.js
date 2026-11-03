"use strict";

const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");
const config = require("../config/config");

const LOCATORS = {
  firstNameInput: By.name("customer.firstName"),
  lastNameInput: By.name("customer.lastName"),
  addressInput: By.name("customer.address.street"),
  cityInput: By.name("customer.address.city"),
  stateInput: By.name("customer.address.state"),
  zipCodeInput: By.name("customer.address.zipCode"),
  phoneInput: By.name("customer.phoneNumber"),
  ssnInput: By.name("customer.ssn"),
  usernameInput: By.name("customer.username"),
  passwordInput: By.name("customer.password"),
  confirmPasswordInput: By.name("repeatedPassword"),
  registerButton: By.xpath("//input[@value='Register']"),
  firstNameError: By.id("customer.firstName.errors"),
  lastNameError: By.id("customer.lastName.errors"),
  addressError: By.id("customer.address.street.errors"),
  cityError: By.id("customer.address.city.errors"),
  stateError: By.id("customer.address.state.errors"),
  zipCodeError: By.id("customer.address.zipCode.errors"),
  phoneError: By.id("customer.phoneNumber.errors"),
  ssnError: By.id("customer.ssn.errors"),
  usernameError: By.id("customer.username.errors"),
  passwordError: By.id("customer.password.errors"),
  confirmPasswordError: By.id("repeatedPassword.errors"),
  successHeader: By.css("#rightPanel h1.title"),
  errorMessage: By.css("#rightPanel .error"),
  duplicateUsernameError: By.css("#rightPanel .error")
};

class RegistrationPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = LOCATORS;
  }

  async navigate() {
    await this.navigateTo(config.paths.register);
  }

  async verifyAllFieldsPresent() {
    const fields = [
      LOCATORS.firstNameInput,
      LOCATORS.lastNameInput,
      LOCATORS.addressInput,
      LOCATORS.cityInput,
      LOCATORS.stateInput,
      LOCATORS.zipCodeInput,
      LOCATORS.phoneInput,
      LOCATORS.ssnInput,
      LOCATORS.usernameInput,
      LOCATORS.passwordInput,
      LOCATORS.confirmPasswordInput,
      LOCATORS.registerButton
    ];
    const results = {};
    for (const locator of fields) {
      const present = await this.isElementPresent(locator);
      results[locator.toString()] = present;
    }
    return results;
  }

  async fillField(locator, value) {
    const el = await this.waitForVisible(locator);
    await el.clear();
    await el.sendKeys(value);
  }

  async fillRegistrationForm(data) {
    if (data.firstName !== undefined)
      await this.fillField(LOCATORS.firstNameInput, data.firstName);
    if (data.lastName !== undefined)
      await this.fillField(LOCATORS.lastNameInput, data.lastName);
    if (data.address !== undefined)
      await this.fillField(LOCATORS.addressInput, data.address);
    if (data.city !== undefined)
      await this.fillField(LOCATORS.cityInput, data.city);
    if (data.state !== undefined)
      await this.fillField(LOCATORS.stateInput, data.state);
    if (data.zipCode !== undefined)
      await this.fillField(LOCATORS.zipCodeInput, data.zipCode);
    if (data.phone !== undefined)
      await this.fillField(LOCATORS.phoneInput, data.phone);
    if (data.ssn !== undefined)
      await this.fillField(LOCATORS.ssnInput, data.ssn);
    if (data.username !== undefined)
      await this.fillField(LOCATORS.usernameInput, data.username);
    if (data.password !== undefined)
      await this.fillField(LOCATORS.passwordInput, data.password);
    if (data.confirmPassword !== undefined)
      await this.fillField(LOCATORS.confirmPasswordInput, data.confirmPassword);
  }

  async submitRegistrationForm() {
    const btn = await this.waitForClickable(LOCATORS.registerButton);
    await btn.click();
  }

  async verifySuccessMessage() {
    const header = await this.waitForVisible(LOCATORS.successHeader);
    return header.getText();
  }

  async getErrorMessage() {
    const el = await this.waitForVisible(LOCATORS.errorMessage);
    return el.getText();
  }

  async getFieldError(fieldName) {
    const errorMap = {
      firstName: LOCATORS.firstNameError,
      lastName: LOCATORS.lastNameError,
      address: LOCATORS.addressError,
      city: LOCATORS.cityError,
      state: LOCATORS.stateError,
      zipCode: LOCATORS.zipCodeError,
      phone: LOCATORS.phoneError,
      ssn: LOCATORS.ssnError,
      username: LOCATORS.usernameError,
      password: LOCATORS.passwordError,
      confirmPassword: LOCATORS.confirmPasswordError
    };
    const locator = errorMap[fieldName];
    if (!locator) throw new Error(`Unknown field: ${fieldName}`);
    const present = await this.isElementPresent(locator);
    if (!present) return null;
    const el = await this.waitForVisible(locator);
    return el.getText();
  }

  async isFieldErrorPresent(fieldName) {
    const errorText = await this.getFieldError(fieldName);
    return errorText !== null && errorText.trim().length > 0;
  }

  async getSsnFieldType() {
    return this.getElementAttribute(LOCATORS.ssnInput, "type");
  }

  async verifySSNFieldMasking() {
    const inputType = await this.getSsnFieldType();
    return inputType === "password";
  }

  async verifyHTTPS() {
    const url = await this.getCurrentUrl();
    return url.startsWith("https://");
  }

  async clearField(locator) {
    const el = await this.waitForVisible(locator);
    await el.clear();
  }
}

module.exports = RegistrationPage;
