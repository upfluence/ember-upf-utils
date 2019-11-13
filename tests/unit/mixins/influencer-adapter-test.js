import EmberObject from '@ember/object';
import InfluencerAdapterMixin from '@upfluence/ember-upf-utils/mixins/influencer-adapter';
import { module, test } from 'qunit';

module('Unit | Mixin | influencer-adapter', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let InfluencerAdapterObject = EmberObject.extend(InfluencerAdapterMixin);
    let subject = InfluencerAdapterObject.create();
    assert.ok(subject);
  });
});
