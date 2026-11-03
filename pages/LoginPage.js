"use strict";

const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");
const config = require("../config/config");

const LOCATORS = {
  usernameInput: By.name("username"),
  passwordInput: By.name("password"),
  loginButton: By.xpath("//input[@value='Log In']"),
  errorMessage: By.css("#rightPanel .error p")
};

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = LOCATORS;
  }

  async navigate() {
    await this.navigateTo(config.paths.login);
  }

  async login(username, password) {
    const usernameEl = await this.waitForVisible(LOCATORS.usernameInput);
    await usernameEl.clear();
    await usernameEl.sendKeys(username);

    const passwordEl = await this.waitForVisible(LOCATORS.passwordInput);
    await passwordEl.clear();
    await passwordEl.sendKeys(password);

    const loginBtn = await this.waitForClickable(LOCATORS.loginButton);
    await loginBtn.click();
  }

  async getErrorMessage() {
    const el = await this.waitForVisible(LOCATORS.errorMessage);
    return el.getText();
  }

  async isErrorDisplayed() {
    return this.isElementPresent(LOCATORS.errorMessage);
  }
}

module.exports = LoginPage;
