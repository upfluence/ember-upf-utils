import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { objectKeys } from '@upfluence/ember-upf-utils/utils/object-keys';

module('Unit | Utility | object-keys', function (hooks) {
  setupTest(hooks);

  test('returns keys for an object', function (assert) {
    assert.deepEqual(objectKeys({ a: 1, b: 2, c: 3 }), ['a', 'b', 'c']);
  });

  test('returns an empty array for an empty object', function (assert) {
    assert.deepEqual(objectKeys({}), []);
  });

  test('returns keys for an object with nested objects', function (assert) {
    assert.deepEqual(objectKeys({ a: 1, b: { c: 2 } }), ['a', 'b']);
  });
});
