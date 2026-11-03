'use strict';

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const config = require('../config/config');
const { waitForUrl } = require('../utils/waitUtil');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      usernameInput: By.name('username'),
      passwordInput: By.name('password'),
      loginButton: By.xpath("//input[@value='Log In']"),
      errorMessage: By.css('#rightPanel .error p')
    };
  }

  async open() {
    await this.navigate(config.loginUrl);
  }

  async login(username, password) {
    const usernameEl = await this.waitForVisible(this.locators.usernameInput);
    await usernameEl.clear();
    await usernameEl.sendKeys(username);

    const passwordEl = await this.waitForVisible(this.locators.passwordInput);
    await passwordEl.clear();
    await passwordEl.sendKeys(password);

    const loginBtn = await this.waitForClickable(this.locators.loginButton);
    await loginBtn.click();
  }

  async getErrorMessage() {
    const el = await this.waitForVisible(this.locators.errorMessage);
    return el.getText();
  }

  async isLoginFormPresent() {
    try {
      await this.waitForVisible(this.locators.usernameInput, 5000);
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = LoginPage;
