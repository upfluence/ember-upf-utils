import EmberObject from '@ember/object';
import ActivityRunnerMixin from 'ember-upf-utils/mixins/activity-runner';
import { module, test } from 'qunit';

module('Unit | Mixin | activity runner', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let ActivityRunnerObject = EmberObject.extend(ActivityRunnerMixin);
    let subject = ActivityRunnerObject.create();
    assert.ok(subject);
  });
});
