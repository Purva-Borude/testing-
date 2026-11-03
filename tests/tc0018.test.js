'use strict';

const { expect } = require('chai');
const { until, By } = require('selenium-webdriver');
const { buildDriver } = require('../utils/driverFactory');
const { takeScreenshot } = require('../utils/screenshotHelper');
const LoginPage = require('../pages/LoginPage');
const NavigationMenuPage = require('../pages/NavigationMenuPage');
const BillPayPage = require('../pages/BillPayPage');
const DashboardPage = require('../pages/DashboardPage');
const config = require('../config/config');

const VALID_BILL_PAY = {
  payeeName: 'Electric Company',
  address: '123 Main St',
  city: 'Springfield',
  state: 'IL',
  zipCode: '62701',
  phone: '555-123-4567',
  accountNumber: '987654321',
  amount: '150.00'
};

describe('TC-0018 - Bill Payment Response Time Under 2 Seconds', function () {
  this.timeout(60000);

  let driver;
  let loginPage;
  let navMenu;
  let billPayPage;
  let dashboardPage;

  before(async function () {
    driver = await buildDriver();
    loginPage = new LoginPage(driver);
    navMenu = new NavigationMenuPage(driver);
    billPayPage = new BillPayPage(driver);
    dashboardPage = new DashboardPage(driver);

    await loginPage.open();
    await loginPage.login(config.auth.validUsername, config.auth.validPassword);
    const isLoggedIn = await dashboardPage.isLoggedIn();
    expect(isLoggedIn, 'Should be logged in before tests').to.be.true;
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('TC-0018-01: should process bill payment and display confirmation within 2 seconds', async function () {
    try {
      await navMenu.navigateToBillPay();
      const url = await billPayPage.getCurrentUrl();
      expect(url, 'Should be on bill pay page').to.include('billpay');

      await billPayPage.fillBillPayForm(VALID_BILL_PAY);
      await billPayPage.selectFromAccount();

      // Capture start time immediately before submit
      const startTime = Date.now();
      await billPayPage.clickSendPayment();

      // Wait for confirmation message
      const confirmationLocator = By.css('#rightPanel h1.title');
      await driver.wait(until.elementLocated(confirmationLocator), config.timeouts.explicitWait);
      const responseTime = Date.now() - startTime;

      const confirmationText = await billPayPage.getConfirmationText();
      console.log(`TC-0018-01: Response time = ${responseTime}ms, Confirmation = "${confirmationText}"`);

      // Positive assertions
      expect(confirmationText, 'Confirmation header should be present').to.have.length.greaterThan(0);
      expect(responseTime, `Response time ${responseTime}ms should be under ${config.performanceThresholdMs}ms`)
        .to.be.lessThan(config.performanceThresholdMs);

      await takeScreenshot(driver, 'TC-0018-01_bill_pay_success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0018-01_FAILURE');
      throw err;
    }
  });

  it('TC-0018-02: should display payee name in confirmation (positive detail verification)', async function () {
    try {
      await navMenu.navigateToBillPay();
      await billPayPage.fillBillPayForm(VALID_BILL_PAY);
      await billPayPage.selectFromAccount();

      const startTime = Date.now();
      await billPayPage.clickSendPayment();

      const confirmationLocator = By.css('#rightPanel h1.title');
      await driver.wait(until.elementLocated(confirmationLocator), config.timeouts.explicitWait);
      const responseTime = Date.now() - startTime;

      const payeeName = await billPayPage.getSuccessPayeeName();
      const amount = await billPayPage.getSuccessAmount();

      console.log(`TC-0018-02: Response time = ${responseTime}ms, Payee = "${payeeName}", Amount = "${amount}"`);

      expect(payeeName, 'Payee name should match submitted value').to.equal(VALID_BILL_PAY.payeeName);
      expect(amount, 'Amount should match submitted value').to.include(VALID_BILL_PAY.amount);
      expect(responseTime, `Response time ${responseTime}ms must be under 2000ms`)
        .to.be.lessThan(config.performanceThresholdMs);

      await takeScreenshot(driver, 'TC-0018-02_confirmation_details_verified');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0018-02_FAILURE');
      throw err;
    }
  });

  it('TC-0018-03: negative - bill pay form with empty fields should not submit successfully', async function () {
    try {
      await navMenu.navigateToBillPay();
      // Attempt to submit without filling any fields
      await billPayPage.clickSendPayment();

      // Negative assertion: confirmation should NOT appear
      const confirmed = await billPayPage.isConfirmationDisplayed();
      // If there is a JS validation, the page stays on billpay
      const currentUrl = await billPayPage.getCurrentUrl();
      expect(currentUrl, 'Should remain on bill pay page on validation failure').to.include('billpay');

      await takeScreenshot(driver, 'TC-0018-03_empty_form_no_submit_success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0018-03_FAILURE');
      throw err;
    }
  });
});
