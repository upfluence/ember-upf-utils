import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { parseAddressComponents } from '@upfluence/ember-upf-utils/utils/address-parser';
import { createSampleAddressComponents } from '@upfluence/ember-upf-utils/utils/google-maps-mock';

module('Unit | Utility | address-parser', function (hooks) {
  setupTest(hooks);

  module('parseAddressComponents', function () {
    test('parses a complete US address correctly', function (assert) {
      const components = createSampleAddressComponents({
        streetNumber: '1600',
        route: 'Amphitheatre Parkway',
        city: 'Mountain View',
        state: 'California',
        zipcode: '94043',
        country: 'United States',
        countryCode: 'US'
      });

      const result = parseAddressComponents(components, '1600 Amphitheatre Parkway, Mountain View, CA 94043');

      assert.strictEqual(result.address1, '1600 Amphitheatre Parkway', 'address1 is correct');
      assert.strictEqual(result.city, 'Mountain View', 'city is correct');
      assert.strictEqual(result.state, 'California', 'state is correct');
      assert.strictEqual(result.zipcode, '94043', 'zipcode is correct');
      assert.strictEqual(result.country.alpha2, 'US', 'country code is correct');
      assert.strictEqual(result.formattedAddress, '1600 Amphitheatre Parkway, Mountain View, CA 94043');
    });

    test('parses address with apartment/suite number (subpremise)', function (assert) {
      const components = createSampleAddressComponents({
        streetNumber: '123',
        route: 'Main Street',
        subpremise: 'Apt 4B',
        city: 'New York',
        state: 'New York',
        zipcode: '10001',
        countryCode: 'US'
      });

      const result = parseAddressComponents(components, '');

      assert.strictEqual(result.address1, '123 Main Street');
      assert.strictEqual(result.address2, 'Apt 4B');
      assert.strictEqual(result.city, 'New York');
    });

    test('handles address without street number', function (assert) {
      const components = [
        { types: ['route'], long_name: 'Broadway', short_name: 'Broadway' },
        { types: ['locality'], long_name: 'New York', short_name: 'New York' },
        { types: ['administrative_area_level_1'], long_name: 'New York', short_name: 'NY' },
        { types: ['postal_code'], long_name: '10001', short_name: '10001' },
        { types: ['country'], long_name: 'United States', short_name: 'US' }
      ];

      const result = parseAddressComponents(components, '');

      assert.strictEqual(result.address1, 'Broadway');
      assert.strictEqual(result.city, 'New York');
    });

    test('handles postal_code_suffix for extended zip codes', function (assert) {
      const components = [
        { types: ['street_number'], long_name: '123', short_name: '123' },
        { types: ['route'], long_name: 'Main St', short_name: 'Main St' },
        { types: ['locality'], long_name: 'Portland', short_name: 'Portland' },
        { types: ['administrative_area_level_1'], long_name: 'Oregon', short_name: 'OR' },
        { types: ['postal_code'], long_name: '97201', short_name: '97201' },
        { types: ['postal_code_suffix'], long_name: '1234', short_name: '1234' },
        { types: ['country'], long_name: 'United States', short_name: 'US' }
      ];

      const result = parseAddressComponents(components, '');

      assert.strictEqual(result.zipcode, '97201-1234');
    });

    test('uses postal_town as city when locality is not available', function (assert) {
      const components = [
        { types: ['street_number'], long_name: '10', short_name: '10' },
        { types: ['route'], long_name: 'Downing Street', short_name: 'Downing St' },
        { types: ['postal_town'], long_name: 'London', short_name: 'London' },
        { types: ['postal_code'], long_name: 'SW1A 2AA', short_name: 'SW1A 2AA' },
        { types: ['country'], long_name: 'United Kingdom', short_name: 'GB' }
      ];

      const result = parseAddressComponents(components, '');

      assert.strictEqual(result.city, 'London');
      assert.strictEqual(result.country.alpha2, 'GB');
    });

    test('postal_town takes precedence over locality when both present', function (assert) {
      const components = [
        { types: ['route'], long_name: 'Test Street', short_name: 'Test St' },
        { types: ['postal_town'], long_name: 'Postal Town', short_name: 'Postal Town' },
        { types: ['locality'], long_name: 'Actual City', short_name: 'Actual City' },
        { types: ['postal_code'], long_name: '12345', short_name: '12345' },
        { types: ['country'], long_name: 'United States', short_name: 'US' }
      ];

      const result = parseAddressComponents(components, '');

      assert.strictEqual(result.city, 'Postal Town');
    });

    test('handles international address (France)', function (assert) {
      const components = createSampleAddressComponents({
        streetNumber: '5',
        route: 'Avenue Anatole France',
        city: 'Paris',
        state: 'Île-de-France',
        zipcode: '75007',
        country: 'France',
        countryCode: 'FR'
      });

      const result = parseAddressComponents(components, '');

      assert.strictEqual(result.address1, '5 Avenue Anatole France');
      assert.strictEqual(result.city, 'Paris');
      assert.strictEqual(result.country.alpha2, 'FR');
    });

    test('defaults to US when country code is not recognized', function (assert) {
      const components = [
        { types: ['route'], long_name: 'Unknown Street', short_name: 'Unknown St' },
        { types: ['locality'], long_name: 'Unknown City', short_name: 'Unknown City' },
        { types: ['country'], long_name: 'Unknown Country', short_name: 'XX' }
      ];

      const result = parseAddressComponents(components, '');

      assert.strictEqual(result.country.alpha2, 'US');
    });

    test('handles empty address components array', function (assert) {
      const result = parseAddressComponents([], '123 Test St');

      assert.strictEqual(result.address1, '');
      assert.strictEqual(result.city, '');
      assert.strictEqual(result.state, '');
      assert.strictEqual(result.zipcode, '');
      assert.strictEqual(result.country.alpha2, 'US');
      assert.strictEqual(result.formattedAddress, '123 Test St');
    });

    test('omits address2 when not present', function (assert) {
      const components = createSampleAddressComponents({
        streetNumber: '123',
        route: 'Main St',
        city: 'Test City',
        zipcode: '12345',
        countryCode: 'US'
      });

      const result = parseAddressComponents(components, '');

      assert.notOk('address2' in result);
    });

    test('preserves formatted address parameter', function (assert) {
      const components = createSampleAddressComponents({});
      const formattedAddress = '1600 Amphitheatre Parkway, Mountain View, CA 94043, USA';

      const result = parseAddressComponents(components, formattedAddress);

      assert.strictEqual(result.formattedAddress, formattedAddress);
    });

    test('handles missing formatted address parameter', function (assert) {
      const components = createSampleAddressComponents({});

      const result = parseAddressComponents(components);

      assert.strictEqual(result.formattedAddress, '');
    });
  });
});
