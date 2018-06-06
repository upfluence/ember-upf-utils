import Ember from 'ember';
import ActivityRunnerMixin from 'ember-upf-utils/mixins/activity-runner';
import { module, test } from 'qunit';

module('Unit | Mixin | activity runner');

// Replace this with your real tests.
test('it works', function(assert) {
  let ActivityRunnerObject = Ember.Object.extend(ActivityRunnerMixin);
  let subject = ActivityRunnerObject.create();
  assert.ok(subject);
});
