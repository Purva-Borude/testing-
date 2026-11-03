require_relative '../spec/spec_helper'
require_relative '../lib/api_client'
require_relative '../lib/response_validator'
require_relative '../lib/screenshot_helper'

RSpec.describe 'TC-001 — Get API List (Happy Path)', type: :functional do
  let(:required_string_fields) { %w[basePath description docs title] }
  let(:response) do
    ApiClient.get('/rest/apis/', headers: { 'Content-Type' => 'application/json' })
  end

  context 'when a GET /rest/apis/ request is made with Content-Type: application/json' do
    it 'returns HTTP 200' do
      expect(response.code).to eq(200),
        -> {
          path = ScreenshotHelper.capture('tc001_failure', "Status: #{response.code}\n#{response.body}")
          "Expected 200 but got #{response.code}. Dump saved to #{path}"
        }
    end

    it 'returns a JSON body' do
      parsed = ApiClient.parse_json(response)
      expect(parsed).not_to be_nil,
        -> {
          path = ScreenshotHelper.capture('tc001_invalid_json', response.body)
          "Response body is not valid JSON. Dump saved to #{path}"
        }
    end

    it 'returns a non-empty JSON array of API entries' do
      parsed = ApiClient.parse_json(response)
      expect(parsed).to be_an(Array),
        -> {
          path = ScreenshotHelper.capture('tc001_not_array', parsed.inspect)
          "Expected Array but got #{parsed.class}. Dump saved to #{path}"
        }
      expect(parsed).not_to be_empty,
        -> {
          path = ScreenshotHelper.capture('tc001_empty_array', parsed.inspect)
          "Response array is empty. Dump saved to #{path}"
        }
    end

    it 'contains basePath, description, docs, and title as strings in every entry' do
      parsed = ApiClient.parse_json(response)
      expect(parsed).to be_an(Array)

      begin
        ResponseValidator.assert_entries_have_string_fields(parsed, required_string_fields)
        path = ScreenshotHelper.capture('tc001_success', parsed.to_json)
        puts "\n  ✔ Success dump saved to #{path}"
      rescue RuntimeError => e
        path = ScreenshotHelper.capture('tc001_field_validation_failure', e.message)
        fail "Field validation failed: #{e.message}. Dump saved to #{path}"
      end
    end

    # ── Negative assertion ────────────────────────────────────────────────────
    it 'does NOT return a non-200 status code' do
      expect(response.code).not_to be >= 400,
        -> {
          path = ScreenshotHelper.capture('tc001_negative_status', "Status: #{response.code}\n#{response.body}")
          "Received error status #{response.code}. Dump saved to #{path}"
        }
    end
  end
end
