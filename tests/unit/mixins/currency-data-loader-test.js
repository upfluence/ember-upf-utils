import EmberObject from '@ember/object';
import CurrencyDataLoaderMixin from '@upfluence/ember-upf-utils/mixins/currency-data-loader';
import { module, test } from 'qunit';

module('Unit | Mixin | currency data loader', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let CurrencyDataLoaderObject = EmberObject.extend(CurrencyDataLoaderMixin);
    let subject = CurrencyDataLoaderObject.create();
    assert.ok(subject);
  });
});
