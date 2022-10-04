import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import EmberObject from '@ember/object';
import sinon from 'sinon';
import { find, render, setupOnerror, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import click from '@ember/test-helpers/dom/click';
import { DEFAULT_IMAGE_URL } from '@upfluence/ember-upf-utils/components/utils/product-row';

module('Integration | Component | utils/product-row', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.intl = this.owner.lookup('service:intl');
    this.product = EmberObject.create({
      name: 'Product test',
      price: 12.95,
      priceCurrency: 'USD',
      productOptions: [{ name: 'Normal' }, { name: 'Large' }],
      providerProductId: 4791551229996,
      imageUrl:
        'https://cdn.shopify.com/s/files/1/0363/6694/2252/products/Giorgio-Armani-Rouge-dArmani-Lipstick.jpg?v=1585157413'
    });

    this.onSelect = sinon.stub();
    this.onView = sinon.stub();
    this.onEdit = sinon.stub();
    this.onRemove = sinon.stub();
  });

  test('it renders', async function (assert) {
    await render(hbs`<Utils::ProductRow @product={{this.product}} />`);
    assert.dom('.product-row').exists();
    assert.dom('.product-row .fx-col span:first-child').exists();
    assert.dom('.product-row .fx-col span:first-child').hasText(this.product.name);

    assert.dom('.product-row .fx-col span:last-child').exists();
    assert
      .dom('.product-row .fx-col span:last-child')
      .hasText(
        this.intl.t('upf_utils.product_row.product_options', { nbProductOptions: this.product.productOptions.length })
      );
  });

  test('it throws an error if product is not provided', async function (assert) {
    setupOnerror((err: Error) => {
      assert.equal(err.message, 'Assertion Failed: [Utils::ProducRow] The @product need to be provided');
    });

    await render(hbs`<Utils::ProductRow />`);
  });

  module('image display', function () {
    test('it displays the product image when the product has a imageUrl', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} />`);

      assert.dom('.product-row').exists();
      assert.dom('.product-row img').exists();
      assert.dom('.product-row img').hasAttribute('src', this.product.imageUrl);
    });

    test('it displays the default image when the product has not a imageUrl', async function (assert) {
      this.product.imageUrl = undefined;
      await render(hbs`<Utils::ProductRow @product={{this.product}} />`);

      assert.dom('.product-row').exists();
      assert.dom('.product-row img').exists();
      assert.dom('.product-row img').hasAttribute('src', DEFAULT_IMAGE_URL);
    });

    test('it displays the default image when the image fails to load', async function (assert) {
      this.product.imageUrl = 'https://www.image-url-test.com';
      await render(hbs`<Utils::ProductRow @product={{this.product}} />`);
      await waitUntil(function () {
        return find('.product-row img')?.getAttribute('src') === DEFAULT_IMAGE_URL;
      });
      assert.dom('.product-row').exists();
      assert.dom('.product-row img').exists();
      assert.dom('.product-row img').hasAttribute('src', DEFAULT_IMAGE_URL);
    });
  });

  module('@selected parameter', function () {
    test('if undefined, the tag is not displayed', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} />`);
      assert.dom('.product-row').exists();
      assert.dom('.product-row .fx-row .upf-tag').doesNotExist();
    });

    test('if true, the tag is displayed', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} @selected={{true}} />`);
      assert.dom('.product-row').exists();
      assert.dom('.product-row .fx-row .upf-tag').exists();
    });

    test('if false, the tag is not displayed', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} @selected={{false}} />`);
      assert.dom('.product-row').exists();
      assert.dom('.product-row .fx-row .upf-tag').doesNotExist();
    });
  });

  module('@plain parameter', function () {
    test('if undefined, the background-color is white', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} />`);
      assert.dom('.product-row.product-row--plain').doesNotExist();
    });

    test('if true, the background-color is gray', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} @plain={{true}} />`);
      assert.dom('.product-row.product-row--plain').exists();
    });

    test('if false, the background-color is white', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} @plain={{false}} />`);
      assert.dom('.product-row.product-row--plain').doesNotExist();
    });
  });

  module('@selectedOption parameter', function () {
    test('if undefined and @product has productOption, then it displays the number of product option', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} />`);
      assert.dom('.product-row').exists();
      assert.dom('.product-row .fx-col span:first-child').exists();
      assert.dom('.product-row .fx-col span:first-child').hasText(this.product.name);

      assert.dom('.product-row .fx-col span:last-child').exists();
      assert
        .dom('.product-row .fx-col span:last-child')
        .hasText(
          this.intl.t('upf_utils.product_row.product_options', { nbProductOptions: this.product.productOptions.length })
        );
    });

    test('if undefined and @product has no productOption, then it displays only the product name', async function (assert) {
      this.product.productOptions = [];
      await render(hbs`<Utils::ProductRow @product={{this.product}} />`);
      assert.dom('.product-row').exists();
      assert.dom('.product-row .fx-col span:first-child').exists();
      assert.dom('.product-row .fx-col span:first-child').hasText(this.product.name);

      assert.dom('.product-row .fx-col span:last-child').exists();
      assert.dom('.product-row .fx-col span:last-child').hasNoText();
    });

    test('if @selectedOption is provided, then it displays the name of the selected product option', async function (assert) {
      this.selectedOption = this.product.productOptions[0];
      await render(
        hbs`<Utils::ProductRow @product={{this.product}} @selectedOption={{this.selectedOption}} />`
      );
      assert.dom('.product-row').exists();

      assert.dom('.product-row .fx-col span:last-child').exists();
      assert.dom('.product-row .fx-col span:last-child').hasText(
        this.intl.t('upf_utils.product_row.option_selected', {
          optionName: this.selectedOption.name
        })
      );
    });
  });

  module('@onSelect parameter', function () {
    test('if undefined,the select button is not displayed', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} />`);
      assert.dom('.product-row').exists();
      assert.dom('.product-row .fx-row .upf-btn').doesNotExist();
    });

    test('if it is provided, the select button is displayed', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} @onSelect={{this.onSelect}} />`);
      assert.dom('.product-row').exists();
      assert.dom('.product-row .fx-row .upf-btn').exists();
      assert.dom('.product-row .fx-row .upf-btn').hasText(this.intl.t('upf_utils.product_row.button.select_label'));
    });

    test('the @onSelect function is triggered when [Select] button has been pressed.', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} @onSelect={{this.onSelect}} />`);
      assert.dom('.product-row').exists();
      await click('.product-row .fx-row .upf-btn');
      assert.true(this.onSelect.calledOnce);
    });
  });

  module('@onView parameter', function () {
    test('if undefined, the view button is not displayed', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} />`);
      assert.dom('.product-row').exists();
      assert.dom('.product-row .fx-row .upf-square-btn').doesNotExist();
    });

    test('if it is provided, the view button is displayed', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} @onView={{this.onView}} />`);
      assert.dom('.product-row').exists();
      assert.dom('.product-row .fx-row .upf-square-btn').exists();
      assert.dom('.product-row .fx-row .upf-square-btn i').hasClass('fa-eye');
    });

    test('the @onView function is triggered when [View] button has been pressed.', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} @onView={{this.onView}} />`);
      assert.dom('.product-row').exists();
      await click('.product-row .fx-row .upf-square-btn');
      assert.true(this.onView.calledOnce);
    });
  });

  module('@onEdit parameter', function () {
    test('if undefined, the edit button is not displayed', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} />`);
      assert.dom('.product-row').exists();
      assert.dom('.product-row .fx-row .upf-square-btn').doesNotExist();
    });

    test('if it is provided, the edit button is displayed', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} @onEdit={{this.onEdit}} />`);
      assert.dom('.product-row').exists();
      assert.dom('.product-row .fx-row .upf-square-btn').exists();
      assert.dom('.product-row .fx-row .upf-square-btn i').hasClass('fa-pencil');
    });

    test('the @onEdit function is triggered when [Edit] button has been pressed.', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} @onEdit={{this.onEdit}} />`);
      assert.dom('.product-row').exists();
      await click('.product-row .fx-row .upf-square-btn');
      assert.true(this.onEdit.calledOnce);
    });
  });

  module('@onRemove parameter', function () {
    test('if undefined, the remove button is not displayed', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} />`);
      assert.dom('.product-row').exists();
      assert.dom('.product-row .fx-row .upf-square-btn').doesNotExist();
    });

    test('if it is provided, the remove button is displayed', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} @onRemove={{this.onRemove}} />`);
      assert.dom('.product-row').exists();
      assert.dom('.product-row .fx-row .upf-square-btn').exists();
      assert.dom('.product-row .fx-row .upf-square-btn i').hasClass('fa-trash');
    });

    test('the @onRemove function is triggered when [Remove] button has been pressed.', async function (assert) {
      await render(hbs`<Utils::ProductRow @product={{this.product}} @onRemove={{this.onRemove}} />`);
      assert.dom('.product-row').exists();
      await click('.product-row .fx-row .upf-square-btn');
      assert.true(this.onRemove.calledOnce);
    });
  });
});
