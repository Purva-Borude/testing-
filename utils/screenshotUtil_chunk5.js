'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config/config');

async function takeScreenshot(driver, testName, type = 'failure') {
  try {
    if (!fs.existsSync(config.screenshotDir)) {
      fs.mkdirSync(config.screenshotDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${testName}_${type}_${timestamp}.png`;
    const filePath = path.join(config.screenshotDir, fileName);
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(filePath, screenshot, 'base64');
    console.log(`Screenshot saved: ${filePath}`);
    return filePath;
  } catch (err) {
    console.error('Failed to take screenshot:', err.message);
    return null;
  }
}

module.exports = { takeScreenshot };
