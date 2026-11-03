'use strict';

const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const config = require('../config/config');
const { waitForUrl } = require('../utils/waitUtil');

async function loginAs(driver, username, password) {
  const loginPage = new LoginPage(driver);
  await loginPage.open();
  await loginPage.login(username, password);
  await waitForUrl(driver, 'overview.htm', config.waits.explicit);
}

async function loginWithDefaults(driver) {
  await loginAs(driver, config.credentials.validUsername, config.credentials.validPassword);
}

module.exports = { loginAs, loginWithDefaults };
