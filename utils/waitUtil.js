"use strict";

const { until, By } = require("selenium-webdriver");
const config = require("../config/config");

const DEFAULT_TIMEOUT = config.waits.explicit;

async function waitForVisible(driver, locator, timeout = DEFAULT_TIMEOUT) {
  const element = await driver.wait(
    until.elementLocated(locator),
    timeout,
    `Element not located: ${JSON.stringify(locator)}`
  );
  await driver.wait(
    until.elementIsVisible(element),
    timeout,
    `Element not visible: ${JSON.stringify(locator)}`
  );
  return element;
}

async function waitForClickable(driver, locator, timeout = DEFAULT_TIMEOUT) {
  const element = await driver.wait(
    until.elementLocated(locator),
    timeout,
    `Element not located: ${JSON.stringify(locator)}`
  );
  await driver.wait(
    until.elementIsEnabled(element),
    timeout,
    `Element not enabled: ${JSON.stringify(locator)}`
  );
  return element;
}

async function waitForText(driver, locator, text, timeout = DEFAULT_TIMEOUT) {
  await driver.wait(
    until.elementLocated(locator),
    timeout,
    `Element not located: ${JSON.stringify(locator)}`
  );
  await driver.wait(
    async () => {
      try {
        const el = await driver.findElement(locator);
        const elText = await el.getText();
        return elText.includes(text);
      } catch (_) {
        return false;
      }
    },
    timeout,
    `Text '${text}' not found in element: ${JSON.stringify(locator)}`
  );
}

module.exports = { waitForVisible, waitForClickable, waitForText };
