'use strict';

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

const SELECTORS = {
  usernameInput: By.name('username'),
  passwordInput: By.name('password'),
  loginButton: By.xpath("//input[@value='Log In']"),
  errorMessage: By.css('#rightPanel .error p')
};

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  async open() {
    await this.navigate('/parabank/login.htm');
  }

  async enterUsername(username) {
    await this.typeText(SELECTORS.usernameInput, username);
  }

  async enterPassword(password) {
    await this.typeText(SELECTORS.passwordInput, password);
  }

  async clickLogin() {
    await this.clickElement(SELECTORS.loginButton);
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage() {
    return this.getText(SELECTORS.errorMessage);
  }

  async isErrorDisplayed() {
    return this.isElementPresent(SELECTORS.errorMessage);
  }
}

module.exports = LoginPage;
