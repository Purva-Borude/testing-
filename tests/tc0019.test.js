'use strict';

const { expect } = require('chai');
const { until, By } = require('selenium-webdriver');
const { buildDriver } = require('../utils/driverFactory');
const { takeScreenshot } = require('../utils/screenshotHelper');
const LoginPage = require('../pages/LoginPage');
const NavigationMenuPage = require('../pages/NavigationMenuPage');
const OpenNewAccountPage = require('../pages/OpenNewAccountPage');
const DashboardPage = require('../pages/DashboardPage');
const config = require('../config/config');

describe('TC-0019 - New Account Opening Response Time Under 2 Seconds', function () {
  this.timeout(60000);

  let driver;
  let loginPage;
  let navMenu;
  let openAccountPage;
  let dashboardPage;

  before(async function () {
    driver = await buildDriver();
    loginPage = new LoginPage(driver);
    navMenu = new NavigationMenuPage(driver);
    openAccountPage = new OpenNewAccountPage(driver);
    dashboardPage = new DashboardPage(driver);

    await loginPage.open();
    await loginPage.login(config.auth.validUsername, config.auth.validPassword);
    const isLoggedIn = await dashboardPage.isLoggedIn();
    expect(isLoggedIn, 'Should be logged in before running tests').to.be.true;
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('TC-0019-01: should open a Checking account and display account number within 2 seconds', async function () {
    try {
      await navMenu.navigateToOpenNewAccount();
      const url = await openAccountPage.getCurrentUrl();
      expect(url, 'Should navigate to open account page').to.include('openaccount');

      // Select Checking (value=0)
      await openAccountPage.selectAccountType('0');
      await openAccountPage.selectFromAccount();

      const startTime = Date.now();
      await openAccountPage.clickOpenNewAccount();

      // Wait for new account ID to appear
      const newAccountId = await openAccountPage.getNewAccountId();
      const responseTime = Date.now() - startTime;

      console.log(`TC-0019-01: Response time = ${responseTime}ms, New Account ID = "${newAccountId}"`);

      // Positive assertions
      expect(newAccountId, 'New account ID should be a non-empty numeric string')
        .to.match(/^\d+$/);
      expect(responseTime, `Response time ${responseTime}ms should be under ${config.performanceThresholdMs}ms`)
        .to.be.lessThan(config.performanceThresholdMs);

      await takeScreenshot(driver, 'TC-0019-01_checking_account_opened_success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0019-01_FAILURE');
      throw err;
    }
  });

  it('TC-0019-02: should open a Savings account and display account number within 2 seconds', async function () {
    try {
      await navMenu.navigateToOpenNewAccount();

      // Select Savings (value=1)
      await openAccountPage.selectAccountType('1');
      await openAccountPage.selectFromAccount();

      const startTime = Date.now();
      await openAccountPage.clickOpenNewAccount();

      const newAccountId = await openAccountPage.getNewAccountId();
      const responseTime = Date.now() - startTime;

      console.log(`TC-0019-02: Response time = ${responseTime}ms, New Savings Account ID = "${newAccountId}"`);

      expect(newAccountId, 'New savings account ID should be numeric').to.match(/^\d+$/);
      expect(responseTime, `Response time ${responseTime}ms must be under 2000ms`)
        .to.be.lessThan(config.performanceThresholdMs);

      const confirmationText = await openAccountPage.getConfirmationText();
      expect(confirmationText, 'Confirmation header should be displayed').to.have.length.greaterThan(0);

      await takeScreenshot(driver, 'TC-0019-02_savings_account_opened_success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0019-02_FAILURE');
      throw err;
    }
  });

  it('TC-0019-03: negative - account number should not be empty on success', async function () {
    try {
      await navMenu.navigateToOpenNewAccount();
      await openAccountPage.selectAccountType('0');
      await openAccountPage.selectFromAccount();
      await openAccountPage.clickOpenNewAccount();

      const newAccountId = await openAccountPage.getNewAccountId();

      // Negative assertion: account ID must not be blank or zero
      expect(newAccountId, 'Account ID must not be empty').to.not.be.empty;
      expect(newAccountId, 'Account ID must not be zero').to.not.equal('0');

      await takeScreenshot(driver, 'TC-0019-03_account_id_not_empty_verified');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0019-03_FAILURE');
      throw err;
    }
  });
});
