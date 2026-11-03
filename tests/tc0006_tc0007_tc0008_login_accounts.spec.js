'use strict';

const { expect } = require('chai');
const { buildDriver } = require('../utils/driverFactory');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const AccountOverviewPage = require('../pages/AccountOverviewPage');
const OpenNewAccountPage = require('../pages/OpenNewAccountPage');
const { loginWithDefaults } = require('../helpers/authHelper');
const { waitForUrl } = require('../utils/waitUtil');
const { takeScreenshot } = require('../utils/screenshotUtil');
const config = require('../config/config');

describe('TC-0006 | TC-0007 | TC-0008 - Login and Account Tests', function () {
  this.timeout(60000);
  let driver;

  beforeEach(async function () {
    driver = await buildDriver();
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('TC-0006 | Successful login with valid credentials navigates to overview', async function () {
    const loginPage = new LoginPage(driver);
    const dashboardPage = new DashboardPage(driver);
    try {
      await loginPage.open();
      await loginPage.login(config.credentials.validUsername, config.credentials.validPassword);
      await waitForUrl(driver, 'overview.htm', config.waits.explicit);
      const isLoggedIn = await dashboardPage.isLoggedIn();
      expect(isLoggedIn).to.be.true;
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('overview.htm');
      await takeScreenshot(driver, 'TC-0006', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0006', 'failure');
      throw err;
    }
  });

  it('TC-0007 | Login with invalid credentials shows error message', async function () {
    const loginPage = new LoginPage(driver);
    try {
      await loginPage.open();
      await loginPage.login('invaliduser_xyz', 'wrongpassword123');
      const errMsg = await loginPage.getErrorMessage();
      expect(errMsg).to.not.be.empty;
      const isFormPresent = await loginPage.isLoginFormPresent();
      expect(isFormPresent).to.be.false; // redirected to error page
      await takeScreenshot(driver, 'TC-0007', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0007', 'failure');
      throw err;
    }
  });

  it('TC-0008 | Account overview displays accounts with unique numbers', async function () {
    const overviewPage = new AccountOverviewPage(driver);
    try {
      await loginWithDefaults(driver);
      await overviewPage.open();
      const isVisible = await overviewPage.isAccountTableVisible();
      expect(isVisible).to.be.true;
      const accountNumbers = await overviewPage.getAccountNumbers();
      expect(accountNumbers.length).to.be.greaterThan(0);
      // Verify unique account numbers
      const uniqueNumbers = new Set(accountNumbers);
      expect(uniqueNumbers.size).to.equal(accountNumbers.length);
      await takeScreenshot(driver, 'TC-0008', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0008', 'failure');
      throw err;
    }
  });
});
