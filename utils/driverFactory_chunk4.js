'use strict';

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('../config/config');

async function buildDriver(headless = false) {
  const options = new chrome.Options();
  if (headless) {
    options.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage');
  }
  options.addArguments('--window-size=1920,1080');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({
    implicit: config.timeouts.implicitWait,
    pageLoad: config.timeouts.pageLoad
  });

  return driver;
}

module.exports = { buildDriver };
