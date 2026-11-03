require 'rspec'
require 'rest-client'
require 'json'
require 'fileutils'

RSpec.configure do |config|
  config.color = true
  config.formatter = :documentation
end
