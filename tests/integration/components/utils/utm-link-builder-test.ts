import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import click from '@ember/test-helpers/dom/click';
import sinon from 'sinon';
import typeIn from '@ember/test-helpers/dom/type-in';
import settled from '@ember/test-helpers/settled';

module('Integration | Component | utils/utm-link-builder', function (hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function () {
    this.onChange = sinon.spy();
  });

  test('it renders', async function (assert) {
    await render(hbs`<Utils::UtmLinkBuilder />`);

    assert.dom('.utm-container').exists();
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
    await typeIn('[data-control-name="utm_source_input"] .upf-input', 'a');
    assert.true(
      this.onChange.calledWith(
        '{link_url}?utm_source=a&utm_medium={medium_field}&utm_campaign={campaign_field}',
        true,
        false,
        utmFields
      )
    );

    utmFields.utm_medium = 'b';
    await typeIn('[data-control-name="utm_medium_input"] .upf-input', 'b');
    assert.true(
      this.onChange.calledWith(
        '{link_url}?utm_source=a&utm_medium=b&utm_campaign={campaign_field}',
        true,
        false,
        utmFields
      )
    );

    utmFields.utm_campaign = 'c';
    await typeIn('[data-control-name="utm_campaign_input"] .upf-input', 'c');
    assert.true(this.onChange.calledWith('{link_url}?utm_source=a&utm_medium=b&utm_campaign=c', true, true, utmFields));
    await settled();
  });

  test('If a space character is inputed, it is replaced with a + sign', async function (assert) {
    await render(hbs`<Utils::UtmLinkBuilder @onChange={{this.onChange}} />`);
    await click('.upf-toggle');
    await typeIn('[data-control-name="utm_source_input"] .upf-input', 'a a');
    await settled();
    assert.dom('[data-control-name="utm_source_input"] .upf-input').hasValue('a+a');
  });
});
