"use strict";

const fs = require("fs");
const path = require("path");

const SCREENSHOT_DIR = path.join(__dirname, "..", "screenshots");

function ensureScreenshotDir() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
}

async function takeScreenshot(driver, name) {
  try {
    ensureScreenshotDir();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${name}_${timestamp}.png`;
    const filepath = path.join(SCREENSHOT_DIR, filename);
    const image = await driver.takeScreenshot();
    fs.writeFileSync(filepath, image, "base64");
    console.log(`Screenshot saved: ${filepath}`);
    return filepath;
  } catch (err) {
    console.error(`Failed to take screenshot: ${err.message}`);
  }
}

module.exports = { takeScreenshot };
