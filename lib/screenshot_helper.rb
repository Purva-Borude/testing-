require 'fileutils'

module ScreenshotHelper
  SCREENSHOT_DIR = File.expand_path('../../screenshots', __FILE__)

  # Saves a plain-text 'screenshot' (response dump) for API tests.
  # Mirrors the intent of screenshot capture used in UI tests.
  def self.capture(label, content)
    FileUtils.mkdir_p(SCREENSHOT_DIR)
    timestamp = Time.now.strftime('%Y%m%d_%H%M%S_%L')
    filename  = "#{SCREENSHOT_DIR}/#{label}_#{timestamp}.txt"
    File.write(filename, content.to_s)
    filename
  end
end
