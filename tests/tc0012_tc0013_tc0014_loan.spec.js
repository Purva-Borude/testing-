'use strict';

const { expect } = require('chai');
const { buildDriver } = require('../utils/driverFactory');
const RequestLoanPage = require('../pages/RequestLoanPage');
const DashboardPage = require('../pages/DashboardPage');
const { loginWithDefaults } = require('../helpers/authHelper');
const { takeScreenshot } = require('../utils/screenshotUtil');

describe('TC-0012 | TC-0013 | TC-0014 - Request Loan Tests', function () {
  this.timeout(60000);
  let driver;
  let loanPage;
  let dashboardPage;

  beforeEach(async function () {
    driver = await buildDriver();
    loanPage = new RequestLoanPage(driver);
    dashboardPage = new DashboardPage(driver);
    await loginWithDefaults(driver);
    await dashboardPage.navigateToRequestLoan();
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('TC-0012 | Approvable loan request shows Approved status', async function () {
    try {
      await loanPage.fillLoanForm('1000', '200');
      await loanPage.selectFirstFromAccount();
      await loanPage.submitLoanApplication();
      const isResultVisible = await loanPage.isResultsPanelVisible();
      expect(isResultVisible).to.be.true;
      const status = await loanPage.getLoanStatus();
      expect(status).to.include('Approved');
      const newAccountId = await loanPage.getNewAccountId();
      expect(newAccountId).to.match(/\d+/);
      await takeScreenshot(driver, 'TC-0012', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0012', 'failure');
      throw err;
    }
  });

  it('TC-0013 | Excessive loan amount shows Denied status', async function () {
    try {
      await loanPage.fillLoanForm('9999999', '1');
      await loanPage.selectFirstFromAccount();
      await loanPage.submitLoanApplication();
      const isResultVisible = await loanPage.isResultsPanelVisible();
      expect(isResultVisible).to.be.true;
      const status = await loanPage.getLoanStatus();
      expect(status).to.include('Denied');
      await takeScreenshot(driver, 'TC-0013', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0013', 'failure');
      throw err;
    }
  });

  it('TC-0014 | Submitting loan form with empty fields shows validation error', async function () {
    try {
      await loanPage.fillLoanForm('', '');
      await loanPage.selectFirstFromAccount();
      await loanPage.submitLoanApplication();
      // Expect either an error message or the form to remain
      let hasError = false;
      try {
        const errMsg = await loanPage.getErrorMessage();
        if (errMsg && errMsg.length > 0) {
          hasError = true;
        }
      } catch (e) {
        // Check if page URL still on requestloan
        const url = await driver.getCurrentUrl();
        if (url.includes('requestloan')) {
          hasError = true;
        }
      }
      expect(hasError).to.be.true;
      await takeScreenshot(driver, 'TC-0014', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0014', 'failure');
      throw err;
    }
  });
});
