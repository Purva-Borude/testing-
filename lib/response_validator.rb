module ResponseValidator
  # Asserts that each entry in an array of hashes contains the expected string fields.
  def assert_entries_have_string_fields(entries, fields)
    raise ArgumentError, 'entries must be an Array' unless entries.is_a?(Array)

    entries.each_with_index do |entry, idx|
      fields.each do |field|
        raise "Entry[#{idx}] missing key '#{field}'" unless entry.key?(field)
        raise "Entry[#{idx}]['#{field}'] is not a String (got #{entry[field].class})" unless entry[field].is_a?(String)
      end
    end
  end

  module_function :assert_entries_have_string_fields
end
