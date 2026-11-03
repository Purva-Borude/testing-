"use strict";

const { By } = require("selenium-webdriver");
const { waitForVisible, waitForClickable } = require("../utils/waitUtil");
const { takeScreenshot } = require("../utils/screenshotUtil");
const config = require("../config/config");

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async navigateTo(path) {
    await this.driver.get(`${config.baseUrl}${path}`);
  }

  async getCurrentUrl() {
    return this.driver.getCurrentUrl();
  }

  async getPageTitle() {
    return this.driver.getTitle();
  }

  async waitForVisible(locator, timeout) {
    return waitForVisible(this.driver, locator, timeout);
  }

  async waitForClickable(locator, timeout) {
    return waitForClickable(this.driver, locator, timeout);
  }

  async screenshot(name) {
    return takeScreenshot(this.driver, name);
  }

  async getElementText(locator) {
    const el = await this.waitForVisible(locator);
    return el.getText();
  }

  async isElementPresent(locator) {
    try {
      const elements = await this.driver.findElements(locator);
      return elements.length > 0;
    } catch (_) {
      return false;
    }
  }

  async getElementAttribute(locator, attribute) {
    const el = await this.waitForVisible(locator);
    return el.getAttribute(attribute);
  }
}

module.exports = BasePage;
