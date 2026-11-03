'use strict';

const { until, By } = require('selenium-webdriver');
const config = require('../config/config');

async function waitForVisible(driver, locator, timeout = config.waits.explicit) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  return element;
}

async function waitForClickable(driver, locator, timeout = config.waits.explicit) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsEnabled(element), timeout);
  return element;
}

async function waitForText(driver, locator, text, timeout = config.waits.explicit) {
  await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(async () => {
    try {
      const el = await driver.findElement(locator);
      const elText = await el.getText();
      return elText.includes(text);
    } catch (e) {
      return false;
    }
  }, timeout);
  return driver.findElement(locator);
}

async function waitForUrl(driver, urlPart, timeout = config.waits.explicit) {
  await driver.wait(until.urlContains(urlPart), timeout);
}

module.exports = { waitForVisible, waitForClickable, waitForText, waitForUrl };
