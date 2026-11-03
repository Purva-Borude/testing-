'use strict';

const { expect } = require('chai');
const { buildDriver } = require('../utils/driverFactory');
const BillPayPage = require('../pages/BillPayPage');
const DashboardPage = require('../pages/DashboardPage');
const { loginWithDefaults } = require('../helpers/authHelper');
const { takeScreenshot } = require('../utils/screenshotUtil');

const VALID_BILL = {
  payeeName: 'Electric Company',
  address: '123 Main St',
  city: 'Springfield',
  state: 'IL',
  zipCode: '62701',
  phone: '555-123-4567',
  accountNumber: '987654321',
  amount: '150.00'
};

describe('TC-0009 | TC-0010 | TC-0011 - Bill Pay Tests', function () {
  this.timeout(60000);
  let driver;
  let billPayPage;
  let dashboardPage;

  beforeEach(async function () {
    driver = await buildDriver();
    billPayPage = new BillPayPage(driver);
    dashboardPage = new DashboardPage(driver);
    await loginWithDefaults(driver);
    await dashboardPage.navigateToBillPay();
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('TC-0009 | Successful bill payment shows confirmation', async function () {
    try {
      await billPayPage.fillBillPayForm(VALID_BILL);
      await billPayPage.selectFirstFromAccount();
      await billPayPage.submitPayment();
      const confirmText = await billPayPage.getConfirmationText();
      expect(confirmText).to.include('Bill Payment Complete');
      const successPayee = await billPayPage.getSuccessPayeeName();
      expect(successPayee).to.include('Electric Company');
      await takeScreenshot(driver, 'TC-0009', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0009', 'failure');
      throw err;
    }
  });

  it('TC-0010 | Submitting empty bill pay form shows validation errors', async function () {
    try {
      await billPayPage.submitPayment();
      const payeeNameErr = await billPayPage.getFieldError(billPayPage.locators.payeeNameError);
      expect(payeeNameErr).to.not.be.null;
      const addressErr = await billPayPage.getFieldError(billPayPage.locators.addressError);
      expect(addressErr).to.not.be.null;
      const amountErr = await billPayPage.getFieldError(billPayPage.locators.amountError);
      expect(amountErr).to.not.be.null;
      await takeScreenshot(driver, 'TC-0010', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0010', 'failure');
      throw err;
    }
  });

  it('TC-0011 | Bill pay with zero amount shows validation error', async function () {
    const invalidBill = { ...VALID_BILL, amount: '0' };
    try {
      await billPayPage.fillBillPayForm(invalidBill);
      await billPayPage.selectFirstFromAccount();
      await billPayPage.submitPayment();
      const amountErr = await billPayPage.getFieldError(billPayPage.locators.amountError);
      expect(amountErr).to.not.be.null;
      await takeScreenshot(driver, 'TC-0011', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0011', 'failure');
      throw err;
    }
  });
});
