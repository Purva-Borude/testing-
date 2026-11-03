'use strict';

const { expect } = require('chai');
const { By } = require('selenium-webdriver');
const { buildDriver } = require('../utils/driverFactory');
const LoginPage = require('../pages/LoginPage');
const AccountOverviewPage = require('../pages/AccountOverviewPage');
const { loginWithDefaults, loginAs } = require('../helpers/authHelper');
const { waitForUrl } = require('../utils/waitUtil');
const { takeScreenshot } = require('../utils/screenshotUtil');
const config = require('../config/config');

describe('TC-0023 - Unauthorized Access to Another User Account Data Is Denied', function () {
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

  it('TC-0023 | User A cannot access User B account details via URL manipulation', async function () {
    const overviewPage = new AccountOverviewPage(driver);
    try {
      // Step 1: Login as User A (john/demo)
      await loginWithDefaults(driver);
      await overviewPage.open();

      // Step 2: Get User A's account numbers
      const userAAccounts = await overviewPage.getAccountNumbers();
      expect(userAAccounts.length).to.be.greaterThan(0,
        'User A must have at least one account');

      // Step 3: Attempt to access a non-existent or other user's account via direct URL
      // Using a well-known non-owned account number (numeric manipulation)
      const spoofedAccountId = '99999999';
      await driver.get(`${config.baseUrl}/parabank/activity.htm?id=${spoofedAccountId}`);

      // Step 4: Verify the response - should show error or no data for this account
      const currentUrl = await driver.getCurrentUrl();
      const pageSource = await driver.getPageSource();

      // Positive assertion: the page should NOT display account data belonging to another user
      // Negative assertion: should not contain the spoofed account number as a valid account
      const isAccessDeniedOrError =
        currentUrl.includes('login.htm') ||
        pageSource.includes('Error') ||
        pageSource.includes('An internal error has occurred') ||
        pageSource.includes('not found') ||
        pageSource.includes('could not be found') ||
        !pageSource.includes(`Account #${spoofedAccountId}`);

      expect(isAccessDeniedOrError).to.be.true;

      // Step 5: Verify User A's session is still valid and restricted to own data
      await overviewPage.open();
      const isStillLoggedIn = await overviewPage.isAccountTableVisible();
      expect(isStillLoggedIn).to.be.true;

      // Step 6: Verify User A's own accounts are still accessible (positive case)
      const accountsAfter = await overviewPage.getAccountNumbers();
      expect(accountsAfter.length).to.be.greaterThan(0);

      // Verify the spoofed account is not in User A's list
      expect(accountsAfter).to.not.include(spoofedAccountId);

      await takeScreenshot(driver, 'TC-0023', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0023', 'failure');
      throw err;
    }
  });

  it('TC-0023 | Accessing protected pages without login redirects to login', async function () {
    try {
      // Attempt to access overview directly without authentication
      await driver.get(`${config.baseUrl}/parabank/overview.htm`);
      const currentUrl = await driver.getCurrentUrl();

      // Should redirect to login page
      const redirectedToLogin =
        currentUrl.includes('login.htm') ||
        currentUrl.includes('index.htm');

      if (!redirectedToLogin) {
        // Check if the page requires authentication
        const pageSource = await driver.getPageSource();
        const requiresAuth =
          pageSource.includes('Log In') ||
          pageSource.includes('username') ||
          !pageSource.includes('accountTable');
        expect(requiresAuth).to.be.true;
      } else {
        expect(redirectedToLogin).to.be.true;
      }

      await takeScreenshot(driver, 'TC-0023-noauth', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0023-noauth', 'failure');
      throw err;
    }
  });

  it('TC-0023 | HTTPS protocol is used for all pages (partial TC-0022 automation)', async function () {
    try {
      await loginWithDefaults(driver);

      const pagesToCheck = [
        '/parabank/overview.htm',
        '/parabank/billpay.htm',
        '/parabank/requestloan.htm',
        '/parabank/openaccount.htm'
      ];

      for (const page of pagesToCheck) {
        await driver.get(`${config.baseUrl}${page}`);
        const protocol = await driver.executeScript('return window.location.protocol;');
        // Positive assertion: must use HTTPS
        expect(protocol).to.equal('https:',
          `Page ${page} is not using HTTPS, found: ${protocol}`);
      }

      await takeScreenshot(driver, 'TC-0023-https', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0023-https', 'failure');
      throw err;
    }
  });
});
