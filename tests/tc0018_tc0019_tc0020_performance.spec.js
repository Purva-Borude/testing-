'use strict';

const { expect } = require('chai');
const { buildDriver } = require('../utils/driverFactory');
const BillPayPage = require('../pages/BillPayPage');
const OpenNewAccountPage = require('../pages/OpenNewAccountPage');
const RequestLoanPage = require('../pages/RequestLoanPage');
const DashboardPage = require('../pages/DashboardPage');
const { loginWithDefaults } = require('../helpers/authHelper');
const { takeScreenshot } = require('../utils/screenshotUtil');
const config = require('../config/config');

const PERFORMANCE_THRESHOLD_MS = config.performanceThresholdMs;

describe('TC-0018 | TC-0019 | TC-0020 - Performance Timing Tests', function () {
  this.timeout(90000);
  let driver;

  beforeEach(async function () {
    driver = await buildDriver();
    await loginWithDefaults(driver);
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('TC-0018 | Bill payment completes within performance threshold', async function () {
    const dashboardPage = new DashboardPage(driver);
    const billPayPage = new BillPayPage(driver);
    try {
      await dashboardPage.navigateToBillPay();
      await billPayPage.fillBillPayForm({
        payeeName: 'Perf Test Payee',
        address: '456 Perf Ave',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        phone: '555-999-0001',
        accountNumber: '111222333',
        amount: '50.00'
      });
      await billPayPage.selectFirstFromAccount();
      const startTime = await billPayPage.submitPayment();
      await billPayPage.getConfirmationText(); // wait for confirmation
      const elapsed = Date.now() - startTime;
      console.log(`TC-0018 Bill Pay response time: ${elapsed}ms`);
      expect(elapsed).to.be.lessThan(PERFORMANCE_THRESHOLD_MS * 3,
        `Bill payment took ${elapsed}ms, exceeding 3x threshold`);
      await takeScreenshot(driver, 'TC-0018', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0018', 'failure');
      throw err;
    }
  });

  it('TC-0019 | Open new account completes within performance threshold', async function () {
    const dashboardPage = new DashboardPage(driver);
    const openAccountPage = new OpenNewAccountPage(driver);
    try {
      await dashboardPage.navigateToOpenNewAccount();
      await openAccountPage.selectAccountType('0');
      await openAccountPage.selectFirstFromAccount();
      const startTime = await openAccountPage.clickOpenNewAccount();
      await openAccountPage.getNewAccountId(); // wait for confirmation
      const elapsed = Date.now() - startTime;
      console.log(`TC-0019 Open Account response time: ${elapsed}ms`);
      expect(elapsed).to.be.lessThan(PERFORMANCE_THRESHOLD_MS * 3,
        `Account opening took ${elapsed}ms, exceeding 3x threshold`);
      await takeScreenshot(driver, 'TC-0019', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0019', 'failure');
      throw err;
    }
  });

  it('TC-0020 | Loan application completes within performance threshold', async function () {
    const dashboardPage = new DashboardPage(driver);
    const loanPage = new RequestLoanPage(driver);
    try {
      await dashboardPage.navigateToRequestLoan();
      await loanPage.fillLoanForm('1000', '200');
      await loanPage.selectFirstFromAccount();
      const startTime = await loanPage.submitLoanApplication();
      await loanPage.getLoanStatus(); // wait for result
      const elapsed = Date.now() - startTime;
      console.log(`TC-0020 Loan Application response time: ${elapsed}ms`);
      expect(elapsed).to.be.lessThan(PERFORMANCE_THRESHOLD_MS * 3,
        `Loan application took ${elapsed}ms, exceeding 3x threshold`);
      await takeScreenshot(driver, 'TC-0020', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0020', 'failure');
      throw err;
    }
  });
});
