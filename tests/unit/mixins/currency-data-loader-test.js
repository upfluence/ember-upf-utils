import Ember from 'ember';
import CurrencyDataLoaderMixin from '@upfluence/ember-upf-utils/mixins/currency-data-loader';
import { module, test } from 'qunit';

module('Unit | Mixin | currency data loader');

// Replace this with your real tests.
test('it works', function(assert) {
  let CurrencyDataLoaderObject = Ember.Object.extend(CurrencyDataLoaderMixin);
  let subject = CurrencyDataLoaderObject.create();
  assert.ok(subject);
});
