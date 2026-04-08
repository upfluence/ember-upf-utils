import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupIntl } from 'ember-intl/test-support';
import { click, render, findAll } from '@ember/test-helpers';

const SELECTABLE_ITEMS = [{ label: 'Account A' }, { label: 'Account B' }, { label: 'Account C' }];

module('Integration | Component | utils/account-banner', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  module('rendering', function () {
    test('it renders', async function (assert) {
      await render(hbs`<Utils::AccountBanner />`);

      assert.dom('.account-banner').exists();
    });

    test('it forwards HTML attributes', async function (assert) {
      await render(hbs`<Utils::AccountBanner data-test="banner" />`);

      assert.dom('.account-banner[data-test="banner"]').exists();
    });
  });

  module('modifier classes', function () {
    test('it renders with no modifier classes by default', async function (assert) {
      await render(hbs`<Utils::AccountBanner />`);

      assert.dom('.account-banner').hasNoClass('account-banner--selected');
      assert.dom('.account-banner').hasNoClass('account-banner--disabled');
      assert.dom('.account-banner').hasNoClass('account-banner--error');
    });

    test('@selected applies selected class', async function (assert) {
      await render(hbs`<Utils::AccountBanner @selected={{true}} />`);

      assert.dom('.account-banner').hasClass('account-banner--selected');
    });

    test('@disabled applies disabled class', async function (assert) {
      await render(hbs`<Utils::AccountBanner @disabled={{true}} />`);

      assert.dom('.account-banner').hasClass('account-banner--disabled');
    });

    test('@skin="error" applies error class', async function (assert) {
      await render(hbs`<Utils::AccountBanner @skin="error" />`);

      assert.dom('.account-banner').hasClass('account-banner--error');
    });

    test('@skin="warning" applies warning class', async function (assert) {
      await render(hbs`<Utils::AccountBanner @skin="warning" />`);

      assert.dom('.account-banner').hasClass('account-banner--warning');
    });

    test('@skin="success" applies success class', async function (assert) {
      await render(hbs`<Utils::AccountBanner @skin="success" />`);

      assert.dom('.account-banner').hasClass('account-banner--success');
    });

    test('selected and disabled can be combined', async function (assert) {
      await render(hbs`<Utils::AccountBanner @selected={{true}} @disabled={{true}} />`);

      assert.dom('.account-banner').hasClass('account-banner--selected');
      assert.dom('.account-banner').hasClass('account-banner--disabled');
    });
  });

  module('icon / image', function () {
    test('it renders @icon', async function (assert) {
      await render(hbs`<Utils::AccountBanner @icon="fa-circle" />`);

      assert.dom('.upf-badge').exists();
    });

    test('it renders @image as a badge', async function (assert) {
      await render(hbs`<Utils::AccountBanner @image="/some/image.svg" />`);

      assert.dom('.icon-in-badge').exists();
    });

    test('@icon takes precedence over @image', async function (assert) {
      await render(hbs`<Utils::AccountBanner @icon="fa-circle" @image="/some/image.svg" />`);

      assert.dom('.upf-badge').exists();
      assert.dom('.icon-in-badge').doesNotExist();
    });
  });

  module('title', function () {
    test('it renders @title', async function (assert) {
      await render(hbs`<Utils::AccountBanner @title="title" />`);

      assert.dom('.account-banner').containsText('title');
    });

    test('it renders the title-suffix block', async function (assert) {
      await render(hbs`
        <Utils::AccountBanner @title="title">
          <:title-suffix><span class="suffix">suffix</span></:title-suffix>
        </Utils::AccountBanner>
      `);

      assert.dom('.suffix').exists();
    });

    test('it does not render title-suffix block when no title', async function (assert) {
      await render(hbs`
        <Utils::AccountBanner>
          <:title-suffix><span class="suffix">suffix</span></:title-suffix>
        </Utils::AccountBanner>
      `);

      assert.dom('.suffix').doesNotExist();
    });
  });

  module('subtitle', function () {
    test('it renders @subtitle', async function (assert) {
      await render(hbs`<Utils::AccountBanner @subtitle="subtitle" />`);

      assert.dom('[data-control-name="account-banner-selected-item-label"]').containsText('subtitle');
    });

    test('it renders custom-subtitle block', async function (assert) {
      await render(hbs`
        <Utils::AccountBanner>
          <:custom-subtitle><span class="custom-sub">custom</span></:custom-subtitle>
        </Utils::AccountBanner>
      `);

      assert.dom('.custom-sub').exists();
    });

    test('@subtitle takes precedence over custom-subtitle block', async function (assert) {
      await render(hbs`
        <Utils::AccountBanner @subtitle="subtitle">
          <:custom-subtitle><span class="custom-sub">custom</span></:custom-subtitle>
        </Utils::AccountBanner>
      `);

      assert.dom('[data-control-name="account-banner-selected-item-label"]').exists();
      assert.dom('.custom-sub').doesNotExist();
    });

    test('it marks subtitle as required when @required is true', async function (assert) {
      await render(hbs`<Utils::AccountBanner @subtitle="subtitle" @required={{true}} />`);

      assert.dom('[data-control-name="account-banner-selected-item-label"]').hasText('subtitle *');
    });

    test('it does not mark subtitle as required when @required is not set', async function (assert) {
      await render(hbs`<Utils::AccountBanner @subtitle="subtitle" />`);

      assert.dom('[data-control-name="account-banner-selected-item-label"]').hasText('subtitle');
    });

    test('account-banner__selection is not rendered without subtitle or custom-subtitle', async function (assert) {
      await render(hbs`<Utils::AccountBanner />`);

      assert.dom('.account-banner__selection').doesNotExist();
    });

    test('unique-account class is applied when canSelectItem is false', async function (assert) {
      await render(hbs`<Utils::AccountBanner @subtitle="label" />`);

      assert.dom('.account-banner__selection--unique-account').exists();
    });
  });

  module('selection dropdown', function () {
    test('chevron is not rendered without canSelectItem', async function (assert) {
      await render(hbs`<Utils::AccountBanner @subtitle="label" @selected={{true}} />`);

      assert.dom('.fa-chevron-down, [data-icon="chevron-down"]').doesNotExist();
    });

    test('chevron is not rendered with only 1 item', async function (assert) {
      await render(hbs`
        <Utils::AccountBanner
          @subtitle="label"
          @selected={{true}}
          @canSelectItem={{true}}
          @selectableItems={{array (hash label="A")}}
        />
      `);

      assert.dom('.fa-chevron-down, [data-icon="chevron-down"]').doesNotExist();
    });

    test('chevron is rendered with canSelectItem and multiple items', async function (assert) {
      this.set('items', SELECTABLE_ITEMS);

      await render(hbs`
        <Utils::AccountBanner
          @subtitle="label"
          @selected={{true}}
          @canSelectItem={{true}}
          @selectableItems={{this.items}}
        />
      `);

      assert.dom('.fa-chevron-down, [data-icon="chevron-down"]').exists();
    });

    test('dropdown opens on click', async function (assert) {
      this.set('items', SELECTABLE_ITEMS);
      await render(hbs`
        <Utils::AccountBanner
          @subtitle="label"
          @selected={{true}}
          @canSelectItem={{true}}
          @selectableItems={{this.items}}
        >
          <:selectable-item as |item|>
            <span class="item">{{item.label}}</span>
          </:selectable-item>
        </Utils::AccountBanner>
      `);

      assert.dom('.upf-floating-menu--hidden').exists();
      await click('.account-banner__selection');
      assert.dom('.upf-floating-menu--visible').exists();
    });

    test('dropdown toggles on successive clicks', async function (assert) {
      this.set('items', SELECTABLE_ITEMS);
      await render(hbs`
        <Utils::AccountBanner
          @subtitle="label"
          @selected={{true}}
          @canSelectItem={{true}}
          @selectableItems={{this.items}}
        >
          <:selectable-item as |item|>
            <span class="item">{{item.label}}</span>
          </:selectable-item>
        </Utils::AccountBanner>
      `);

      await click('.account-banner__selection');
      assert.dom('.upf-floating-menu--visible').exists();
      await click('.account-banner__selection');
      assert.dom('.upf-floating-menu--hidden').exists();
    });

    test('dropdown does not open when @readonly', async function (assert) {
      this.set('items', SELECTABLE_ITEMS);
      await render(hbs`
        <Utils::AccountBanner
          @subtitle="label"
          @selected={{true}}
          @canSelectItem={{true}}
          @selectableItems={{this.items}}
          @readonly={{true}}
        >
          <:selectable-item as |item|>
            <span class="item">{{item.label}}</span>
          </:selectable-item>
        </Utils::AccountBanner>
      `);

      await click('.account-banner__selection');
      assert.dom('.upf-floating-menu--hidden').exists();
    });

    test('closeDropdown callback closes the dropdown', async function (assert) {
      this.set('items', SELECTABLE_ITEMS);
      await render(hbs`
        <Utils::AccountBanner
          @subtitle="label"
          @selected={{true}}
          @canSelectItem={{true}}
          @selectableItems={{this.items}}
        >
          <:selectable-item as |item closeDropdown|>
            <span class="item" role="button" {{on "click" closeDropdown}}>{{item.label}}</span>
          </:selectable-item>
        </Utils::AccountBanner>
      `);

      await click('.account-banner__selection');
      assert.dom('.upf-floating-menu--visible').exists();
      await click('.item');
      assert.dom('.upf-floating-menu--hidden').exists();
    });

    test('clicking inside dropdown does not toggle it', async function (assert) {
      this.set('items', SELECTABLE_ITEMS);
      await render(hbs`
        <Utils::AccountBanner
          @subtitle="label"
          @selected={{true}}
          @canSelectItem={{true}}
          @selectableItems={{this.items}}
        >
          <:selectable-item as |item|>
            <span class="item">{{item.label}}</span>
          </:selectable-item>
        </Utils::AccountBanner>
      `);

      await click('.account-banner__selection');
      assert.dom('.upf-floating-menu--visible').exists();
      await click('.item');
      assert.dom('.upf-floating-menu--visible').exists();
    });

    test('it renders all selectable items', async function (assert) {
      this.set('items', SELECTABLE_ITEMS);
      await render(hbs`
        <Utils::AccountBanner
          @subtitle="label"
          @selected={{true}}
          @canSelectItem={{true}}
          @selectableItems={{this.items}}
        >
          <:selectable-item as |item|>
            <span class="item">{{item.label}}</span>
          </:selectable-item>
        </Utils::AccountBanner>
      `);

      assert.strictEqual(findAll('.item').length, SELECTABLE_ITEMS.length);
    });
  });

  module('feedback message', function () {
    test('it does not render any feedback message by default', async function (assert) {
      await render(hbs`<Utils::AccountBanner @subtitle="label" />`);

      assert.dom('.account-banner__selection + span').doesNotExist();
    });

    test('it renders an error feedback message', async function (assert) {
      this.set('feedback', { type: 'error', value: 'Required field' });
      await render(hbs`<Utils::AccountBanner @subtitle="label" @feedbackMessage={{this.feedback}} />`);

      assert.dom('.account-banner__selection + span').exists();
      assert.dom('.account-banner__selection + span').hasClass('font-color-error-500');
      assert.dom('.account-banner__selection + span').hasText('Required field');
    });

    test('it renders a warning feedback message', async function (assert) {
      this.set('feedback', { type: 'warning', value: 'Be careful' });
      await render(hbs`<Utils::AccountBanner @subtitle="label" @feedbackMessage={{this.feedback}} />`);

      assert.dom('.account-banner__selection + span').exists();
      assert.dom('.account-banner__selection + span').hasClass('font-color-warning-500');
      assert.dom('.account-banner__selection + span').hasText('Be careful');
    });

    test('it applies error border class when feedbackMessage type is error', async function (assert) {
      this.set('feedback', { type: 'error', value: 'Required field' });
      await render(hbs`<Utils::AccountBanner @subtitle="label" @feedbackMessage={{this.feedback}} />`);

      assert.dom('.account-banner').hasClass('account-banner--error');
    });

    test('it does not apply error border class when feedbackMessage type is warning', async function (assert) {
      this.set('feedback', { type: 'warning', value: 'Be careful' });
      await render(hbs`<Utils::AccountBanner @subtitle="label" @feedbackMessage={{this.feedback}} />`);

      assert.dom('.account-banner').hasNoClass('account-banner--error');
    });
  });

  module('alert', function () {
    test('it does not render alert when @alert is not provided', async function (assert) {
      await render(hbs`<Utils::AccountBanner />`);

      assert.dom('.upf-alert').doesNotExist();
    });

    test('it renders alert when @alert is provided', async function (assert) {
      this.set('alert', { skin: 'error', title: 'Error title', subtitle: 'Error subtitle' });
      await render(hbs`<Utils::AccountBanner @alert={{this.alert}} />`);

      assert.dom('.upf-alert').exists();
    });

    test('it renders alert link when provided', async function (assert) {
      this.set('alert', {
        skin: 'error',
        title: 'Error',
        link: { label: 'Link', href: 'https://example.com' }
      });

      await render(hbs`<Utils::AccountBanner @alert={{this.alert}} />`);

      assert.dom('.upf-link').exists();
    });

    test('it does not render link when alert has no link', async function (assert) {
      this.set('alert', { skin: 'error', title: 'Error' });
      await render(hbs`<Utils::AccountBanner @alert={{this.alert}} />`);

      assert.dom('.upf-link').doesNotExist();
    });
  });

  module('actions block', function () {
    test('it renders the actions block', async function (assert) {
      await render(hbs`
        <Utils::AccountBanner>
          <:actions><span class="action">action</span></:actions>
        </Utils::AccountBanner>
      `);

      assert.dom('.action').exists();
    });
  });
});
