import { formatNumber } from 'ember-upf-utils/helpers/format-number';
import { module, test } from 'qunit';

module('Unit | Helper | format number');

test('it works', function(assert) {
  assert.equal(formatNumber([0]), '0');
});

test('it works', function(assert) {
  assert.equal(formatNumber([300000]), '300k');
});

test('it works again', function(assert) {
  assert.equal(formatNumber([3000000]), '3M');
});

test('it works again and again', function(assert) {
  assert.equal(formatNumber([3000000000]), '3G');
});

test('it works with smaller', function(assert) {
  assert.equal(formatNumber([3]), 3);
});

test('it works with bigger', function(assert) {
  assert.equal(formatNumber([30000000000000000000]), '30000000000G');
});

test('it works with big decimal', function(assert) {
  assert.equal(formatNumber([3000000000.1564894951]), '3G');
});

test('it works with small decimal', function(assert) {
  assert.equal(formatNumber([0.1564894951]), '0.16');
});
