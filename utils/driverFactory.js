"use strict";

const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const config = require("../config/config");

async function buildDriver() {
  const options = new chrome.Options();
  // Uncomment for headless mode:
  // options.addArguments("--headless=new");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--window-size=1366,768");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({
    implicit: config.waits.implicit,
    pageLoad: config.waits.pageLoad
  });

  return driver;
}

module.exports = { buildDriver };
