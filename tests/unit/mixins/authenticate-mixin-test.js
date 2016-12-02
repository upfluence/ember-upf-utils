import Ember from 'ember';
import AuthenticateMixinMixin from 'ember-upf-utils/mixins/authenticate-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | authenticate mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let AuthenticateMixinObject = Ember.Object.extend(AuthenticateMixinMixin);
  let subject = AuthenticateMixinObject.create();
  assert.ok(subject);
});
