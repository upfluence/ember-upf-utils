import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupIntl } from 'ember-intl/test-support';
import { render, focus, blur } from '@ember/test-helpers';
import click from '@ember/test-helpers/dom/click';
import sinon from 'sinon';
import typeIn from '@ember/test-helpers/dom/type-in';
import settled from '@ember/test-helpers/settled';

module('Integration | Component | utils/utm-link-builder', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.onChange = sinon.spy();
  });

  test('it renders', async function (assert) {
    await render(hbs`<Utils::UtmLinkBuilder />`);

    assert.dom('.togglable-section').exists();
  });

  test('If the toggle is disabled, the UTM inputs are hidden', async function (assert) {
    await render(hbs`<Utils::UtmLinkBuilder />`);

    assert.dom('[data-control-name="utm_source_input"]').doesNotExist();
    assert.dom('[data-control-name="utm_medium_input"]').doesNotExist();
    assert.dom('[data-control-name="utm_campaign_input"]').doesNotExist();
  });

  test('If the toggle is enabled, the UTM inputs are visible', async function (assert) {
    await render(hbs`<Utils::UtmLinkBuilder @onChange={{this.onChange}} />`);
    await click('.upf-toggle');
    assert.dom('[data-control-name="utm_source_input"]').exists();
    assert.dom('[data-control-name="utm_medium_input"]').exists();
    assert.dom('[data-control-name="utm_campaign_input"]').exists();
  });

  test('The @onChange method is called when inputs are updated', async function (assert) {
    let utmFields = { utm_source: '', utm_campaign: '', utm_medium: '' };
    await render(hbs`<Utils::UtmLinkBuilder @onChange={{this.onChange}} />`);
    await click('.upf-toggle');
    assert.true(
      this.onChange.calledWith(
        '{link_url}?utm_source={source_field}&utm_medium={medium_field}&utm_campaign={campaign_field}',
        true,
        false,
        utmFields
      )
    );

    utmFields.utm_source = 'a';
    await typeIn('[data-control-name="utm_source_input"] .upf-input', 'a', { delay: 0 });
    assert.true(
      this.onChange.calledWith(
        '{link_url}?utm_source=a&utm_medium={medium_field}&utm_campaign={campaign_field}',
        true,
        false,
        utmFields
      )
    );

    utmFields.utm_medium = 'b';
    await typeIn('[data-control-name="utm_medium_input"] .upf-input', 'b', { delay: 0 });
    assert.true(
      this.onChange.calledWith(
        '{link_url}?utm_source=a&utm_medium=b&utm_campaign={campaign_field}',
        true,
        false,
        utmFields
      )
    );

    utmFields.utm_campaign = 'c';
    await typeIn('[data-control-name="utm_campaign_input"] .upf-input', 'c', { delay: 0 });
    assert.true(this.onChange.calledWith('{link_url}?utm_source=a&utm_medium=b&utm_campaign=c', true, true, utmFields));
    await settled();
  });

  test('If a space character is inputted, it is replaced with a + sign', async function (assert) {
    await render(hbs`<Utils::UtmLinkBuilder @onChange={{this.onChange}} />`);
    await click('.upf-toggle');
    await typeIn('[data-control-name="utm_source_input"] .upf-input', 'a a', { delay: 0 });
    await settled();
    assert.dom('[data-control-name="utm_source_input"] .upf-input').hasValue('a+a');
  });

  ['utm_source', 'utm_medium', 'utm_campaign'].forEach((field) => {
    test(`on blur on the ${field} input field, the field is validated and displays the right error if blank`, async function (assert) {
      await render(hbs`<Utils::UtmLinkBuilder @onChange={{this.onChange}} />`);
      await click('.upf-toggle');
      await focus(`[data-control-name="${field}_input"] input`);

      assert.dom(`[data-control-name="${field}_input"] + .font-color-error-500`).doesNotExist();

      await blur(`[data-control-name="${field}_input"] input`);

      assert.dom(`[data-control-name="${field}_input"] + .font-color-error-500`).exists();
      assert
        .dom(`[data-control-name="${field}_input"] + .font-color-error-500`)
        .hasText(this.intl.t('utms.errors.blank_field'));
    });
  });

  test('If variables are unenabled, templated input group component is not rendered', async function (assert) {
    this.variables = ['InstagramUsername', 'TiktokUsername'];

    await render(hbs`<Utils::UtmLinkBuilder @onChange={{this.onChange}} />`);
    await click('.upf-toggle');
    assert.dom('[data-control-name="templated-input-group-insert-variable-link"]').doesNotExist();
  });

  test('If variables are enabled, templated input group component is rendered', async function (assert) {
    this.variables = ['InstagramUsername', 'TiktokUsername'];

    await render(hbs`<Utils::UtmLinkBuilder @onChange={{this.onChange}} @variables={{this.variables}} />`);
    await click('.upf-toggle');
    assert
      .dom('[data-control-name="templated-input-group-insert-variable-link"]')
      .exists({ count: 3 })
      .containsText('Insert variable');
  });

  test('If variables are enabled and a space character is inputed, it is replaced with a + sign', async function (assert) {
    this.variables = ['InstagramUsername', 'TiktokUsername'];

    await render(hbs`<Utils::UtmLinkBuilder @onChange={{this.onChange}} @variables={{this.variables}} />`);
    await click('.upf-toggle');

    await typeIn('[data-control-name="utm_source_input"] .upf-input', 'a a', { delay: 0 });
    await settled();
    assert.dom('[data-control-name="utm_source_input"] .upf-input').hasValue('a+a');
  });
});
