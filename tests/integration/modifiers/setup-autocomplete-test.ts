import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { AutocompletionAddress } from '@upfluence/ember-upf-utils/utils/address-parser';

import {
  createMockPlaceResult,
  createSampleAddressComponents,
  MockLoader
} from '@upfluence/ember-upf-utils/utils/google-maps-mock';

module('Integration | Modifier | setup-autocomplete', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.mockLoader = new MockLoader({ apiKey: 'test-key' });
  });

  module('Element setup', function () {
    test('it works with a text input element directly', async function (assert) {
      await render(
        hbs`<div><input type="text" {{setup-autocomplete callback=(fn (mut this.result)) loader=this.mockLoader}} /></div>`
      );

      assert.dom('input[type="text"]').exists();
      const input = find('input[type="text"]');
      assert.dom(input?.parentElement).hasClass('autocomplete-input-container');
    });

    test('it works with input inside a container element', async function (assert) {
      await render(hbs`
        <div {{setup-autocomplete callback=(fn (mut this.result)) loader=this.mockLoader}}>
          <input type="text" />
        </div>
      `);

      assert.dom('div').hasClass('autocomplete-input-container');
      assert.dom('input[type="text"]').exists();
    });
  });

  module('Callback functionality', function () {
    test('callback is called with parsed address data', async function (assert) {
      assert.expect(1);

      this.handleAddress = (result: AutocompletionAddress) => {
        assert.ok(result, 'callback receives address result');
      };

      await render(hbs`
        <div><input type="text" {{setup-autocomplete callback=this.handleAddress loader=this.mockLoader}} /></div>
      `);

      const mockAutocomplete = this.mockLoader.getMockAutocompleteInstance();
      const mockPlace = createMockPlaceResult(createSampleAddressComponents({}));
      mockAutocomplete?.simulatePlaceSelection(mockPlace);
      await settled();
    });

    test('callback receives all expected address fields', async function (assert) {
      assert.expect(6);

      this.handleAddress = (result: AutocompletionAddress) => {
        assert.ok('address1' in result, 'result has address1');
        assert.ok('city' in result, 'result has city');
        assert.ok('state' in result, 'result has state');
        assert.ok('zipcode' in result, 'result has zipcode');
        assert.ok('country' in result, 'result has country');
        assert.ok('formattedAddress' in result, 'result has formattedAddress');
      };

      await render(hbs`
        <input type="text" {{setup-autocomplete callback=this.handleAddress loader=this.mockLoader}} />
      `);

      const mockAutocomplete = this.mockLoader.getMockAutocompleteInstance();
      const mockPlace = createMockPlaceResult(createSampleAddressComponents({}));
      mockAutocomplete?.simulatePlaceSelection(mockPlace);
      await settled();
    });
  });

  module('Cleanup', function () {
    test('pac-container is removed on teardown', async function (assert) {
      await render(hbs`
        <input type="text" {{setup-autocomplete callback=(fn (mut this.result)) loader=this.mockLoader}} />
      `);

      const pacContainer = document.createElement('div');
      pacContainer.classList.add('pac-container');
      document.body.appendChild(pacContainer);

      assert.ok(document.querySelector('.pac-container'));

      await render(hbs`<div></div>`);

      assert.notOk(document.querySelector('.pac-container'));
    });

    test('wrapper is properly unwrapped during cleanup', async function (assert) {
      await render(
        hbs`<div><input type="text" id="test-input" {{setup-autocomplete callback=(fn (mut this.result)) loader=this.mockLoader}} /></div>`
      );

      assert.dom('#test-input').exists();
      const wrapper = find('#test-input')!.parentElement;
      assert.dom(wrapper).hasClass('autocomplete-input-container');

      const wrapperParent = wrapper?.parentElement;
      assert.dom(wrapperParent).exists();

      await render(hbs`<div id="new-content"></div>`);

      assert.dom('.autocomplete-input-container').doesNotExist();
      assert.dom('#new-content').exists();
    });

    test('cleanup handles already removed elements gracefully', async function (assert) {
      await render(
        hbs`<div><input type="text" {{setup-autocomplete callback=(fn (mut this.result)) loader=this.mockLoader}} /></div>`
      );

      assert.dom('input[type="text"]').exists();
      const input = find('input[type="text"]');

      // Manually remove the wrapper to simulate edge case
      const wrapper = input?.parentElement;
      if (wrapper?.classList.contains('autocomplete-input-container')) {
        wrapper.remove();
      }

      await render(hbs`<div></div>`);
      assert.ok(true, 'cleanup handled gracefully without errors');
    });

    test('wrapper is not created when modifier is on container element', async function (assert) {
      await render(hbs`
        <div {{setup-autocomplete callback=(fn (mut this.result)) loader=this.mockLoader}}>
          <input type="text" id="container-input" />
        </div>
      `);

      const input = find('#container-input') as HTMLInputElement;
      const container = input.parentElement;

      assert.dom(container).hasClass('autocomplete-input-container');
      assert.strictEqual(container?.tagName, 'DIV', 'parent is the original div container');

      await render(hbs`<div></div>`);
      assert.ok(true, 'cleanup completed without trying to unwrap');
    });
  });

  module('Edge cases', function () {
    test('handles missing callback gracefully', async function (assert) {
      await render(hbs`<div><input type="text" {{setup-autocomplete loader=this.mockLoader}} /></div>`);

      assert.dom('input[type="text"]').exists();

      await settled();

      const mockAutocomplete = this.mockLoader.getMockAutocompleteInstance();
      const mockPlace = createMockPlaceResult(createSampleAddressComponents({}));

      mockAutocomplete?.simulatePlaceSelection(mockPlace);
      await settled();

      assert.ok(true, 'no error thrown when callback is missing');
    });

    test('works with pre-filled input value', async function (assert) {
      this.value = '123 Main Street';

      await render(hbs`
        <input type="text" value={{this.value}} {{setup-autocomplete callback=(fn (mut this.result)) loader=this.mockLoader}} />
      `);

      assert.dom('input[type="text"]').hasValue('123 Main Street');
    });

    test('preserves input attributes', async function (assert) {
      await render(hbs`
        <input 
          type="text" 
          id="address-input"
          class="custom-input"
          placeholder="Enter address"
          {{setup-autocomplete callback=(fn (mut this.result)) loader=this.mockLoader}} 
        />
      `);

      assert.dom('input[type="text"]').hasAttribute('id', 'address-input');
      assert.dom('input[type="text"]').hasClass('custom-input');
      assert.dom('input[type="text"]').hasAttribute('placeholder', 'Enter address');
    });

    test('handles international addresses correctly', async function (assert) {
      assert.expect(4);

      this.handleAddress = (result: AutocompletionAddress) => {
        assert.strictEqual(result.address1, '10 Downing Street');
        assert.strictEqual(result.city, 'London');
        assert.strictEqual(result.zipcode, 'SW1A 2AA');
        assert.strictEqual(result.country.alpha2, 'GB');
      };

      await render(hbs`
        <input type="text" {{setup-autocomplete callback=this.handleAddress loader=this.mockLoader}} />
      `);

      const mockAutocomplete = this.mockLoader.getMockAutocompleteInstance();
      const mockPlace = createMockPlaceResult([
        { types: ['street_number'], long_name: '10', short_name: '10' },
        { types: ['route'], long_name: 'Downing Street', short_name: 'Downing St' },
        { types: ['postal_town'], long_name: 'London', short_name: 'London' },
        { types: ['postal_code'], long_name: 'SW1A 2AA', short_name: 'SW1A 2AA' },
        { types: ['country'], long_name: 'United Kingdom', short_name: 'GB' }
      ]);

      mockAutocomplete?.simulatePlaceSelection(mockPlace);
      await settled();
    });
  });
});
