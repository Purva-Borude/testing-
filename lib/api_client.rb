require 'rest-client'
require 'json'

module ApiClient
  BASE_URL = (ENV['API_BASE_URL'] || 'http://localhost:8080').freeze

  # Performs a GET request and returns a response object.
  # Raises RestClient::ExceptionWithResponse on non-2xx so callers can rescue it.
  def self.get(path, headers: {})
    url = "#{BASE_URL}#{path}"
    RestClient.get(url, headers)
  rescue RestClient::ExceptionWithResponse => e
    e.response
  end

  # Parses a RestClient::Response body as JSON.
  # Returns nil when the body is empty or not valid JSON.
  def self.parse_json(response)
    JSON.parse(response.body)
  rescue JSON::ParserError
    nil
  end
end
