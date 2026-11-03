'use strict';

const { By } = require('selenium-webdriver');
const { waitForLocated, waitForClickable } = require('../utils/waitHelper');
const { takeScreenshot } = require('../utils/screenshotHelper');
const config = require('../config/config');

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async navigate(path) {
    await this.driver.get(`${config.baseUrl}${path}`);
  }

  async getCurrentUrl() {
    return this.driver.getCurrentUrl();
  }

  async getTitle() {
    return this.driver.getTitle();
  }

  async screenshot(name) {
    return takeScreenshot(this.driver, name);
  }

  async findElement(locator) {
    return waitForLocated(this.driver, locator);
  }

  async clickElement(locator) {
    const el = await waitForClickable(this.driver, locator);
    await el.click();
    return el;
  }

  async typeText(locator, text) {
    const el = await waitForLocated(this.driver, locator);
    await el.clear();
    await el.sendKeys(text);
  }

  async getText(locator) {
    const el = await waitForLocated(this.driver, locator);
    return el.getText();
  }

  async isElementPresent(locator, timeout = 5000) {
    try {
      await waitForLocated(this.driver, locator, timeout);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = BasePage;
