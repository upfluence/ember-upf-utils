import EmberObject from '@ember/object';
import AuthorizedAjaxMixin from 'ember-upf-utils/mixins/authorized-ajax';
import { module, test } from 'qunit';

module('Unit | Mixin | authorized ajax', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let AuthorizedAjaxObject = EmberObject.extend(AuthorizedAjaxMixin);
    let subject = AuthorizedAjaxObject.create();
    assert.ok(subject);
  });
});
