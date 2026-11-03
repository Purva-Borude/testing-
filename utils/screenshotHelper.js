'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config/config');

async function takeScreenshot(driver, name) {
  try {
    if (!fs.existsSync(config.screenshotDir)) {
      fs.mkdirSync(config.screenshotDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = path.join(config.screenshotDir, `${name}_${timestamp}.png`);
    const image = await driver.takeScreenshot();
    fs.writeFileSync(filename, image, 'base64');
    console.log(`Screenshot saved: ${filename}`);
    return filename;
  } catch (err) {
    console.error(`Failed to take screenshot: ${err.message}`);
  }
}

module.exports = { takeScreenshot };
