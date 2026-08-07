import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import serializeParams from '@upfluence/ember-upf-utils/utils/serialize-params';

module('Unit | Utility | serialize-params', (hooks) => {
  setupTest(hooks);

  module('flat objects', () => {
    test('it serializes a single string entry', function (assert) {
      assert.strictEqual(serializeParams({ name: 'upfluence' }), 'name=upfluence');
    });

    test('it joins several entries with an ampersand', function (assert) {
      assert.strictEqual(serializeParams({ name: 'upfluence', page: 2 }), 'name=upfluence&page=2');
    });

    test('it serializes numbers', function (assert) {
      assert.strictEqual(serializeParams({ page: 2 }), 'page=2');
    });

    test('it serializes zero', function (assert) {
      assert.strictEqual(serializeParams({ page: 0 }), 'page=0');
    });

    test('it serializes booleans', function (assert) {
      assert.strictEqual(serializeParams({ active: true, archived: false }), 'active=true&archived=false');
    });

    test('it serializes an empty string', function (assert) {
      assert.strictEqual(serializeParams({ query: '' }), 'query=');
    });

    test('it returns an empty string for an object without entries', function (assert) {
      assert.strictEqual(serializeParams({}), '');
    });
  });

  module('encoding', () => {
    test('it percent-encodes reserved characters in values', function (assert) {
      assert.strictEqual(serializeParams({ query: 'rock & roll' }), 'query=rock%20%26%20roll');
    });

    test('it percent-encodes reserved characters in keys', function (assert) {
      assert.strictEqual(serializeParams({ 'search query': 'x' }), 'search%20query=x');
    });

    test('it trims surrounding whitespace from keys', function (assert) {
      assert.strictEqual(serializeParams({ '  name  ': 'upfluence' }), 'name=upfluence');
    });

    test('it preserves whitespace inside values', function (assert) {
      assert.strictEqual(serializeParams({ name: '  upfluence  ' }), 'name=%20%20upfluence%20%20');
    });

    test('it encodes non-ascii characters', function (assert) {
      assert.strictEqual(serializeParams({ city: 'Besançon' }), 'city=Besan%C3%A7on');
    });
  });

  module('nested objects', () => {
    test('it prefixes a nested key with its parent between brackets', function (assert) {
      assert.strictEqual(serializeParams({ filter: { name: 'upfluence' } }), 'filter[name]=upfluence');
    });

    test('it serializes every entry of a nested object', function (assert) {
      assert.strictEqual(
        serializeParams({ filter: { name: 'upfluence', page: 2 } }),
        'filter[name]=upfluence&filter[page]=2'
      );
    });

    test('it chains brackets for deeply nested objects', function (assert) {
      assert.strictEqual(serializeParams({ a: { b: { c: 1 } } }), 'a[b][c]=1');
    });

    test('it serializes nested and root entries together', function (assert) {
      assert.strictEqual(serializeParams({ page: 2, filter: { name: 'upfluence' } }), 'page=2&filter[name]=upfluence');
    });
  });

  module('arrays', () => {
    test('it repeats the key with empty brackets for each item', function (assert) {
      assert.strictEqual(serializeParams({ tags: ['vip', 'new'] }), 'tags[]=vip&tags[]=new');
    });

    test('it serializes a single item array', function (assert) {
      assert.strictEqual(serializeParams({ tags: ['vip'] }), 'tags[]=vip');
    });

    test('it encodes array items', function (assert) {
      assert.strictEqual(serializeParams({ tags: ['rock & roll'] }), 'tags[]=rock%20%26%20roll');
    });

    test('it appends a bracket pair per nesting level for nested arrays', function (assert) {
      assert.strictEqual(serializeParams({ ids: [[1, 2]] }), 'ids[][]=1&ids[][]=2');
    });

    test('it serializes objects nested in an array without indexing them', function (assert) {
      assert.strictEqual(
        serializeParams({ filters: [{ name: 'tag' }, { name: 'city' }] }),
        'filters[][name]=tag&filters[][name]=city'
      );
    });
  });

  module('class instances', () => {
    test('it drops the parent prefix when a nested value is a class instance', function (assert) {
      class Filter {
        name = 'tag';
      }

      assert.strictEqual(serializeParams({ filter: new Filter() }), 'name=tag');
    });
  });

  module('null, function and skipped values', () => {
    test('it serializes null as an empty value', function (assert) {
      assert.strictEqual(serializeParams({ name: null }), 'name=');
    });

    test('it serializes a function as an empty value', function (assert) {
      assert.strictEqual(
        serializeParams({
          name: () => 'upfluence'
        }),
        'name='
      );
    });

    test('it skips undefined values', function (assert) {
      assert.strictEqual(serializeParams({ name: undefined, page: 2 }), 'page=2');
    });

    test('it skips NaN values', function (assert) {
      assert.strictEqual(serializeParams({ score: NaN, page: 2 }), 'page=2');
    });

    test('it returns an empty string when every value is skipped', function (assert) {
      assert.strictEqual(serializeParams({ name: undefined, score: NaN }), '');
    });
  });

  module('empty nested values', () => {
    test('it returns an empty string for a lone empty nested object', function (assert) {
      assert.strictEqual(serializeParams({ filter: {} }), '');
    });

    test('it returns an empty string for a lone empty nested array', function (assert) {
      assert.strictEqual(serializeParams({ tags: [] }), '');
    });

    test('it emits a leading separator when an empty nested value precedes a serialized one', function (assert) {
      assert.strictEqual(serializeParams({ filter: {}, page: 2 }), '&page=2');
    });

    test('it emits a trailing separator when an empty nested value follows a serialized one', function (assert) {
      assert.strictEqual(serializeParams({ page: 2, filter: {} }), 'page=2&');
    });
  });
});
