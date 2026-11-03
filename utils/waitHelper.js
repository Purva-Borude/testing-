'use strict';

const { until, By } = require('selenium-webdriver');
const config = require('../config/config');

async function waitForVisible(driver, locator, timeout = config.timeouts.explicitWait) {
  return driver.wait(until.elementIsVisible(await driver.findElement(locator)), timeout);
}

async function waitForLocated(driver, locator, timeout = config.timeouts.explicitWait) {
  return driver.wait(until.elementLocated(locator), timeout);
}

async function waitForClickable(driver, locator, timeout = config.timeouts.explicitWait) {
  const el = await waitForLocated(driver, locator, timeout);
  await driver.wait(until.elementIsEnabled(el), timeout);
  return el;
}

async function waitForText(driver, locator, text, timeout = config.timeouts.explicitWait) {
  return driver.wait(until.elementTextContains(await driver.findElement(locator), text), timeout);
}

module.exports = { waitForVisible, waitForLocated, waitForClickable, waitForText };
