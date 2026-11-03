'use strict';

const { expect } = require('chai');
const { until } = require('selenium-webdriver');
const { buildDriver } = require('../utils/driverFactory');
const { takeScreenshot } = require('../utils/screenshotHelper');
const LoginPage = require('../pages/LoginPage');
const NavigationMenuPage = require('../pages/NavigationMenuPage');
const RequestLoanPage = require('../pages/RequestLoanPage');
const DashboardPage = require('../pages/DashboardPage');
const config = require('../config/config');

describe('TC-0020 - Loan Application Response Time Under 2 Seconds', function () {
  this.timeout(60000);

  let driver;
  let loginPage;
  let navMenu;
  let requestLoanPage;
  let dashboardPage;

  before(async function () {
    driver = await buildDriver();
    loginPage = new LoginPage(driver);
    navMenu = new NavigationMenuPage(driver);
    requestLoanPage = new RequestLoanPage(driver);
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

  it('TC-0020-01: should display loan result screen within 2 seconds for an approvable loan', async function () {
    try {
      await navMenu.navigateToRequestLoan();
      const url = await requestLoanPage.getCurrentUrl();
      expect(url, 'Should navigate to request loan page').to.include('requestloan');

      await requestLoanPage.enterLoanAmount('1000');
      await requestLoanPage.enterDownPayment('200');
      await requestLoanPage.selectFromAccount();

      const startTime = Date.now();
      await requestLoanPage.clickApplyNow();

      const loanStatus = await requestLoanPage.getLoanStatus();
      const responseTime = Date.now() - startTime;

      console.log(`TC-0020-01: Response time = ${responseTime}ms, Loan Status = "${loanStatus}"`);

      // Positive assertions
      expect(loanStatus, 'Loan status should be Approved or Denied').to.match(/Approved|Denied/i);
      expect(responseTime, `Response time ${responseTime}ms should be under ${config.performanceThresholdMs}ms`)
        .to.be.lessThan(config.performanceThresholdMs);

      const isApproved = await requestLoanPage.isApproved();
      if (isApproved) {
        const newAccountId = await requestLoanPage.getNewAccountId();
        expect(newAccountId, 'Approved loan should have a new account ID').to.match(/^\d+$/);
      }

      await takeScreenshot(driver, 'TC-0020-01_loan_result_success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0020-01_FAILURE');
      throw err;
    }
  });

  it('TC-0020-02: should display denial result within 2 seconds for an excessively large loan', async function () {
    try {
      await navMenu.navigateToRequestLoan();

      await requestLoanPage.enterLoanAmount('9999999');
      await requestLoanPage.enterDownPayment('1');
      await requestLoanPage.selectFromAccount();

      const startTime = Date.now();
      await requestLoanPage.clickApplyNow();

      const loanStatus = await requestLoanPage.getLoanStatus();
      const responseTime = Date.now() - startTime;

      console.log(`TC-0020-02: Response time = ${responseTime}ms, Loan Status = "${loanStatus}"`);

      expect(loanStatus, 'Loan status should be present').to.have.length.greaterThan(0);
      expect(responseTime, `Response time ${responseTime}ms should be under ${config.performanceThresholdMs}ms`)
        .to.be.lessThan(config.performanceThresholdMs);

      const isDenied = await requestLoanPage.isDenied();
      expect(isDenied, 'Large loan amount should be denied').to.be.true;

      await takeScreenshot(driver, 'TC-0020-02_loan_denied_success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0020-02_FAILURE');
      throw err;
    }
  });

  it('TC-0020-03: negative - loan result screen must not appear before submission', async function () {
    try {
      await navMenu.navigateToRequestLoan();

      // Do NOT click Apply Now – results panel should not be present yet
      const hasResults = await requestLoanPage.isResultsPanelDisplayed();

      // Negative assertion
      expect(hasResults, 'Results panel should not be visible before submitting').to.be.false;

      await takeScreenshot(driver, 'TC-0020-03_no_premature_results_verified');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0020-03_FAILURE');
      throw err;
    }
  });

  it('TC-0020-04: should confirm loan results panel is displayed after submission', async function () {
    try {
      await navMenu.navigateToRequestLoan();

      await requestLoanPage.enterLoanAmount('2000');
      await requestLoanPage.enterDownPayment('300');
      await requestLoanPage.selectFromAccount();

      const startTime = Date.now();
      await requestLoanPage.clickApplyNow();

      // Wait for status element
      const loanStatus = await requestLoanPage.getLoanStatus();
      const responseTime = Date.now() - startTime;

      console.log(`TC-0020-04: Response time = ${responseTime}ms, Status = "${loanStatus}"`);

      const hasResults = await requestLoanPage.isResultsPanelDisplayed();
      expect(hasResults, 'Results panel should be displayed after submission').to.be.true;
      expect(loanStatus, 'Status must not be empty').to.not.be.empty;
      expect(responseTime, 'Response must be under 2000ms').to.be.lessThan(config.performanceThresholdMs);

      await takeScreenshot(driver, 'TC-0020-04_results_panel_confirmed');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0020-04_FAILURE');
      throw err;
    }
  });
});
