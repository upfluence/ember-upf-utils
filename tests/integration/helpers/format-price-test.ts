import { render } from '@ember/test-helpers';

import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore serializeParams is not typed
import { formatPrice } from '@upfluence/ember-upf-utils/helpers/format-price';

module('Integration | Helper | format-price', (hooks) => {
  setupRenderingTest(hooks);

  module('Default options', () => {
    test('It formats the price in dollars with two decimals', async function (assert) {
      await render(hbs`<div>{{format-price 1234.567}}</div>`);

      assert.dom('div').hasText('$1,234.57');
    });

    test('It drops the decimals when they are zero', async function (assert) {
      await render(hbs`<div>{{format-price 12}}</div>`);

      assert.dom('div').hasText('$12');
    });

    test('It formats zero', async function (assert) {
      await render(hbs`<div>{{format-price 0}}</div>`);

      assert.dom('div').hasText('$0');
    });
  });

  module('Conversion rate', () => {
    test('It applies the given rate to the price', async function (assert) {
      await render(hbs`<div>{{format-price 100 rate=1.5}}</div>`);

      assert.dom('div').hasText('$150');
    });
  });

  module('Currency', () => {
    test('It formats the price in euros', async function (assert) {
      await render(hbs`<div>{{format-price 100 currency="EUR"}}</div>`);

      assert.dom('div').hasText('€100');
    });

    test('It formats the price in pounds', async function (assert) {
      await render(hbs`<div>{{format-price 1234.567 currency="GBP"}}</div>`);

      assert.dom('div').hasText('£1,234.57');
    });

    test('It renders the bare amount when the currency is missing', async function (assert) {
      this.currency = undefined;

      await render(hbs`<div>{{format-price 12.34 currency=this.currency}}</div>`);

      assert.dom('div').hasText('12.34');
    });
  });

  module('Round precision', () => {
    test('It rounds up to the next integer when the precision is zero', async function (assert) {
      await render(hbs`<div>{{format-price 1234.567 roundPrecision=0}}</div>`);

      assert.dom('div').hasText('$1,235');
    });

    test('It keeps a single decimal when the precision is one', async function (assert) {
      await render(hbs`<div>{{format-price 12.34 roundPrecision=1}}</div>`);

      assert.dom('div').hasText('$12.3');
    });

    test('It caps the displayed decimals to the currency precision', async function (assert) {
      await render(hbs`<div>{{format-price 12.3456 roundPrecision=3}}</div>`);

      assert.dom('div').hasText('$12.35');
    });

    test('It leaves the price untouched when the precision is negative', async function (assert) {
      await render(hbs`<div>{{format-price 1234.567 roundPrecision=-1}}</div>`);

      assert.dom('div').hasText('$1,234.57');
    });
  });

  module('Compact formatter', () => {
    test('It applies the compact notation with the currency symbol', async function (assert) {
      await render(hbs`<div>{{format-price 1234.567 useFormatter=true}}</div>`);

      assert.dom('div').hasText('$1.2K');
    });

    test('It uses the symbol of the given currency', async function (assert) {
      await render(hbs`<div>{{format-price 1234.567 useFormatter=true currency="EUR"}}</div>`);

      assert.dom('div').hasText('€1.2K');
    });

    test('It falls back to the dollar sign for an unknown currency', async function (assert) {
      await render(hbs`<div>{{format-price 1234.567 useFormatter=true currency="XYZ"}}</div>`);

      assert.dom('div').hasText('$1.2K');
    });

    test('It does not compact small amounts', async function (assert) {
      await render(hbs`<div>{{format-price 12.34 useFormatter=true}}</div>`);

      assert.dom('div').hasText('$12.34');
    });
  });

  module('Direct invocation', () => {
    test('It falls back to the default options when none is given', function (assert) {
      assert.strictEqual(formatPrice([1234.567]), '$1,234.57');
    });
  });

  module('Unsupported prices', () => {
    test('It renders NaN for a non numeric price', async function (assert) {
      this.price = 'not a price';

      await render(hbs`<div>{{format-price this.price}}</div>`);

      assert.dom('div').hasText('NaN');
    });

    test('It renders NaN for a missing price', async function (assert) {
      this.price = undefined;

      await render(hbs`<div>{{format-price this.price}}</div>`);

      assert.dom('div').hasText('NaN');
    });

    test('It renders zero for a null price', async function (assert) {
      this.price = null;

      await render(hbs`<div>{{format-price this.price}}</div>`);

      assert.dom('div').hasText('$0');
    });
  });
});
