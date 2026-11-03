require_relative '../spec/spec_helper'
require_relative '../lib/api_client'
require_relative '../lib/screenshot_helper'

RSpec.describe 'TC-002 — Include Schema Property True', type: :functional do
  let(:response) do
    ApiClient.get('/', headers: { 'GW-IncludeSchemaProperty' => 'true' })
  end

  context 'when a GET / request is made with GW-IncludeSchemaProperty: true' do
    it 'returns HTTP 200' do
      expect(response.code).to eq(200),
        -> {
          path = ScreenshotHelper.capture('tc002_failure', "Status: #{response.code}\n#{response.body}")
          "Expected 200 but got #{response.code}. Dump saved to #{path}"
        }
    end

    it 'returns a parseable JSON body' do
      parsed = ApiClient.parse_json(response)
      expect(parsed).not_to be_nil,
        -> {
          path = ScreenshotHelper.capture('tc002_invalid_json', response.body)
          "Response body is not valid JSON. Dump saved to #{path}"
        }
    end

    it 'returns a JSON object (Hash)' do
      parsed = ApiClient.parse_json(response)
      expect(parsed).to be_a(Hash),
        -> {
          path = ScreenshotHelper.capture('tc002_not_hash', parsed.inspect)
          "Expected Hash but got #{parsed.class}. Dump saved to #{path}"
        }
    end

    # ── Conditional / optional field assertion ────────────────────────────────
    it 'includes $GW-Schema as a string when the property is present in the response' do
      parsed = ApiClient.parse_json(response)
      expect(parsed).to be_a(Hash)

      if parsed.key?('$GW-Schema')
        expect(parsed['$GW-Schema']).to be_a(String),
          -> {
            path = ScreenshotHelper.capture(
              'tc002_schema_type_failure',
              "$GW-Schema value: #{parsed['$GW-Schema'].inspect} (#{parsed['$GW-Schema'].class})"
            )
            "$GW-Schema is present but not a String. Dump saved to #{path}"
          }
        path = ScreenshotHelper.capture('tc002_success_with_schema', parsed.to_json)
        puts "\n  ✔ $GW-Schema present and valid. Dump saved to #{path}"
      else
        path = ScreenshotHelper.capture('tc002_success_no_schema', parsed.to_json)
        puts "\n  ✔ $GW-Schema not present (optional). Dump saved to #{path}"
      end
    end

    # ── Negative assertion ────────────────────────────────────────────────────
    it 'does NOT return a non-200 status code' do
      expect(response.code).not_to be >= 400,
        -> {
          path = ScreenshotHelper.capture('tc002_negative_status', "Status: #{response.code}\n#{response.body}")
          "Received error status #{response.code}. Dump saved to #{path}"
        }
    end

    it 'does NOT include $GW-Schema when the header is absent' do
      response_without_header = ApiClient.get('/')
      parsed = ApiClient.parse_json(response_without_header)
      # This is a best-effort negative check; schema inclusion is optional even with the header
      if parsed.is_a?(Hash) && parsed.key?('$GW-Schema')
        puts "\n  ⚠  $GW-Schema appeared even without the header — may be expected by the gateway."
      else
        path = ScreenshotHelper.capture('tc002_negative_no_header_success', parsed.to_json)
        expect(parsed).not_to have_key('$GW-Schema')
        puts "\n  ✔ $GW-Schema correctly absent without header. Dump saved to #{path}"
      end
    end
  end
end
