'use strict';

const { By } = require('selenium-webdriver');
const config = require('../config/config');
const { waitForVisible, waitForClickable } = require('../utils/waitUtil');
const { takeScreenshot } = require('../utils/screenshotUtil');

class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.config = config;
  }

  async navigate(path) {
    await this.driver.get(`${config.baseUrl}${path}`);
  }

  async waitForVisible(locator, timeout) {
    return waitForVisible(this.driver, locator, timeout);
  }

  async waitForClickable(locator, timeout) {
    return waitForClickable(this.driver, locator, timeout);
  }

  async screenshot(testName, type) {
    return takeScreenshot(this.driver, testName, type);
  }

  async getCurrentUrl() {
    return this.driver.getCurrentUrl();
  }

  async getTitle() {
    return this.driver.getTitle();
  }
}

module.exports = BasePage;
