import Ember from 'ember';
import LoadingRouteMixin from 'ember-upf-utils/mixins/loading-route';
import { module, test } from 'qunit';

module('Unit | Mixin | loading route');

// Replace this with your real tests.
test('it works', function(assert) {
  let LoadingRouteObject = Ember.Object.extend(LoadingRouteMixin);
  let subject = LoadingRouteObject.create();
  assert.ok(subject);
});
