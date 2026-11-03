"use strict";

const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");
const config = require("../config/config");

const LOCATORS = {
  accountsTable: By.id("accountTable"),
  accountRows: By.css("#accountTable tbody tr"),
  accountLink: By.css("#accountTable tbody tr td a"),
  welcomeMessage: By.css("#rightPanel p.smallText"),
  servicesMenu: By.css("#leftPanel ul.services")
};

class DashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = LOCATORS;
  }

  async isLoaded() {
    const url = await this.getCurrentUrl();
    return url.includes(config.paths.overview);
  }

  async verifyAccountListed() {
    await this.waitForVisible(LOCATORS.accountsTable);
    const rows = await this.driver.findElements(LOCATORS.accountRows);
    return rows.length > 0;
  }

  async getWelcomeText() {
    const present = await this.isElementPresent(LOCATORS.welcomeMessage);
    if (!present) return "";
    const el = await this.waitForVisible(LOCATORS.welcomeMessage);
    return el.getText();
  }
}

module.exports = DashboardPage;
