import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';
import {
  PREVENT_COMPACT_NOTATION_BELOW,
  ROUND_TO_INTEGER_ABOVE
} from '@upfluence/ember-upf-utils/helpers/format-number';

module('Integration | Helper | format-number', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  module('Basic formatting', function () {
    test('Round the number when the threshold is lower and there are decimals', async function (assert) {
      this.number = 834.89;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('835');
    });

    test(`Rounds numbers below ${ROUND_TO_INTEGER_ABOVE} without decimals are formatted with 2 decimals`, async function (assert) {
      this.number = 1;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('1');
    });

    test(`Rounds numbers below ${ROUND_TO_INTEGER_ABOVE} without decimals are formatted without decimals`, async function (assert) {
      this.number = 12.345;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('12.35');
    });

    test(`Rounds numbers equal or above ${ROUND_TO_INTEGER_ABOVE} without decimals are formatted without decimals`, async function (assert) {
      this.number = 123;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('123');
    });

    test('If params does not contain a number, returns -', async function (assert) {
      this.number = 'This is not a number';

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('-');
    });
  });

  module('Compact formatting (K/M/B)', function () {
    test(`Applies a K notation to thousands`, async function (assert) {
      this.number = 1234;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('1.2K');
    });

    test('Applies a M notation to millions', async function (assert) {
      this.number = 1234567;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('1.2M');
    });

    test('Applies a B notation to billions', async function (assert) {
      this.number = 1234567890;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('1.2B');
    });

    test(`Does not apply compact notation below ${PREVENT_COMPACT_NOTATION_BELOW}`, async function (assert) {
      this.number = 834.89;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('835');
    });
  });

  module('Edge cases', function () {
    test('Formats 0 correctly', async function (assert) {
      this.number = 0;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('0');
    });

    test('Formats numbers smaller than 1 correctly', async function (assert) {
      this.number = 0.1234;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('0.12');
    });

    test('Formats negative integers correctly', async function (assert) {
      this.number = -12;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('-12');
    });

    test('Formats negative decimals correctly', async function (assert) {
      this.number = -12.345;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('-12.35');
    });

    test('Applies compact notation to negative thousands', async function (assert) {
      this.number = -1234;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('-1.2K');
    });

    test('Handles null', async function (assert) {
      this.number = null;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('-');
    });

    test('Handles undefined', async function (assert) {
      this.number = undefined;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('-');
    });

    test('Handles NaN', async function (assert) {
      this.number = NaN;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('-');
    });

    test('Formats very large numbers correctly', async function (assert) {
      this.number = 1e12;

      await render(hbs`<div>{{format-number this.number}}</div>`);
      assert.dom('div').hasText('1T');
    });
  });
});
