'use strict';

const { expect } = require('chai');
const { buildDriver } = require('../utils/driverFactory');
const RegistrationPage = require('../pages/RegistrationPage');
const { takeScreenshot } = require('../utils/screenshotUtil');

const VALID_DATA = {
  firstName: 'Test',
  lastName: 'User',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  phone: '555-123-4567',
  ssn: '123-45-6789',
  username: `testuser_${Date.now()}`,
  password: 'SecurePass@123',
  confirmPassword: 'SecurePass@123'
};

describe('TC-0001 | TC-0002 | TC-0003 | TC-0004 - Registration Tests', function () {
  this.timeout(60000);
  let driver;
  let regPage;

  beforeEach(async function () {
    driver = await buildDriver();
    regPage = new RegistrationPage(driver);
    await regPage.open();
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('TC-0001 | Successful registration with valid data', async function () {
    const uniqueData = { ...VALID_DATA, username: `testuser_${Date.now()}` };
    try {
      await regPage.fillRegistrationForm(uniqueData);
      await regPage.submitRegistrationForm();
      const headerText = await regPage.getSuccessHeaderText();
      expect(headerText).to.include('Welcome');
      await takeScreenshot(driver, 'TC-0001', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0001', 'failure');
      throw err;
    }
  });

  it('TC-0002 | Validation errors shown when submitting empty form', async function () {
    try {
      await regPage.submitRegistrationForm();

      const firstNameErr = await regPage.getFieldError(regPage.locators.firstNameError);
      expect(firstNameErr).to.not.be.null;
      expect(firstNameErr).to.include('First name is required');

      const lastNameErr = await regPage.getFieldError(regPage.locators.lastNameError);
      expect(lastNameErr).to.not.be.null;

      const addressErr = await regPage.getFieldError(regPage.locators.addressError);
      expect(addressErr).to.not.be.null;

      const cityErr = await regPage.getFieldError(regPage.locators.cityError);
      expect(cityErr).to.not.be.null;

      const stateErr = await regPage.getFieldError(regPage.locators.stateError);
      expect(stateErr).to.not.be.null;

      const zipErr = await regPage.getFieldError(regPage.locators.zipCodeError);
      expect(zipErr).to.not.be.null;

      const ssnErr = await regPage.getFieldError(regPage.locators.ssnError);
      expect(ssnErr).to.not.be.null;

      const usernameErr = await regPage.getFieldError(regPage.locators.usernameError);
      expect(usernameErr).to.not.be.null;

      const passwordErr = await regPage.getFieldError(regPage.locators.passwordError);
      expect(passwordErr).to.not.be.null;

      await takeScreenshot(driver, 'TC-0002', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0002', 'failure');
      throw err;
    }
  });

  it('TC-0003 | Validation error shown for mismatched passwords', async function () {
    const mismatchData = {
      ...VALID_DATA,
      username: `testuser_${Date.now()}`,
      password: 'SecurePass@123',
      confirmPassword: 'DifferentPass@456'
    };
    try {
      await regPage.fillRegistrationForm(mismatchData);
      await regPage.submitRegistrationForm();
      const confirmErr = await regPage.getFieldError(regPage.locators.confirmPasswordError);
      expect(confirmErr).to.not.be.null;
      expect(confirmErr.length).to.be.greaterThan(0);
      await takeScreenshot(driver, 'TC-0003', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0003', 'failure');
      throw err;
    }
  });

  it('TC-0004 | Duplicate username shows error', async function () {
    // Use a username known to already exist after prior test runs (john)
    const duplicateData = {
      ...VALID_DATA,
      username: 'john'
    };
    try {
      await regPage.fillRegistrationForm(duplicateData);
      await regPage.submitRegistrationForm();
      const errText = await regPage.getErrorMessageText();
      expect(errText).to.not.be.empty;
      await takeScreenshot(driver, 'TC-0004', 'success');
    } catch (err) {
      await takeScreenshot(driver, 'TC-0004', 'failure');
      throw err;
    }
  });
});
