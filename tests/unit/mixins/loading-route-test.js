import EmberObject from '@ember/object';
import LoadingRouteMixin from 'ember-upf-utils/mixins/loading-route';
import { module, test } from 'qunit';

module('Unit | Mixin | loading route', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let LoadingRouteObject = EmberObject.extend(LoadingRouteMixin);
    let subject = LoadingRouteObject.create();
    assert.ok(subject);
  });
});
