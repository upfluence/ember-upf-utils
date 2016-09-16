import Ember from 'ember';
import AuthorizedAjaxMixin from 'ember-upf-utils/mixins/authorized-ajax';
import { module, test } from 'qunit';

module('Unit | Mixin | authorized ajax');

// Replace this with your real tests.
test('it works', function(assert) {
  let AuthorizedAjaxObject = Ember.Object.extend(AuthorizedAjaxMixin);
  let subject = AuthorizedAjaxObject.create();
  assert.ok(subject);
});
