import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import AutocompleteHandlerService from '@upfluence/ember-upf-utils/services/autocomplete-handler';
import { AutocompleteHandlerServiceMock } from '@upfluence/ember-upf-utils/test-support/services/autocomplete-handler';

module('Unit | Service | autocomplete-handler', function (hooks) {
  setupTest(hooks);

  module('Production service', function () {
    test('it exists', function (assert) {
      const service = this.owner.lookup('service:autocomplete-handler');

      assert.ok(service);
      assert.true(service instanceof AutocompleteHandlerService);
    });

    test('getLoader returns a Loader instance', function (assert) {
      const service = this.owner.lookup('service:autocomplete-handler') as AutocompleteHandlerService;
      const loader = service.getLoader();

      assert.ok(loader);
    });

    test('Loader is configured with API key from environment', function (assert) {
      const service = this.owner.lookup('service:autocomplete-handler') as AutocompleteHandlerService;
      const loader = service.getLoader();

      assert.ok(loader);
      assert.strictEqual((loader as any).options.version, 'weekly');
      assert.strictEqual((loader as any).options.apiKey, 'foobar');
    });
  });

  module('Test service', function (hooks) {
    hooks.beforeEach(function () {
      this.owner.register('service:autocomplete-handler', AutocompleteHandlerServiceMock);
    });

    test('it exists', function (assert) {
      const service = this.owner.lookup('service:autocomplete-handler');

      assert.ok(service);
      assert.true(service instanceof AutocompleteHandlerServiceMock);
    });

    test('getLoader returns a MockLoader instance', function (assert) {
      const service = this.owner.lookup('service:autocomplete-handler') as AutocompleteHandlerServiceMock;
      const loader = service.getLoader();

      assert.ok(loader);
    });

    test('MockLoader importLibrary returns places library', async function (assert) {
      const service = this.owner.lookup('service:autocomplete-handler') as AutocompleteHandlerServiceMock;
      const loader = service.getLoader();
      const placesLib = await loader.importLibrary('places');

      assert.ok(placesLib);
      assert.ok(placesLib.Autocomplete);
    });

    test('MockLoader can be accessed for test assertions', function (assert) {
      const service = this.owner.lookup('service:autocomplete-handler') as AutocompleteHandlerServiceMock;
      const mockLoader = service.getLoader();

      assert.ok(mockLoader.getMockAutocompleteInstance);
    });
  });
});
