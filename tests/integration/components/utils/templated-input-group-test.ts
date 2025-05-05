import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupIntl } from 'ember-intl/test-support';
import { click, render, typeIn } from '@ember/test-helpers';
import sinon from 'sinon';

module('Integration | Component | utils/templated-input-group', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.title = 'Title';
    this.subtitle = 'Subtitle';
    this.placeholder = 'Placeholder';
    this.value = '';
    this.variables = ['InstagramUsername', 'TiktokUsername'];
    this.onChange = sinon.spy();
  });

  module('Component rendering', () => {
    test('It renders with minimum parameters', async function (assert) {
      await render(
        hbs`<Utils::TemplatedInputGroup @title={{this.title}} @value={{this.value}} @variables={{this.variables}} @onChange={{this.onChange}} />`
      );

      assert.dom('[data-control-name="templated-input-group-insert-variable-link"]').exists();
      assert
        .dom('[data-control-name="templated-input-group-insert-variable-link"]')
        .hasText(this.intl.t('upf_utils.templated_input_group.insert_variable'));
      assert.dom('[data-control-name="templated-input-group-input-container"]').exists();
      assert.dom('input').doesNotHaveAttribute('placeholder');
    });

    test('Not required field title is properly displayed', async function (assert) {
      await render(
        hbs`<Utils::TemplatedInputGroup @title={{this.title}} @value={{this.value}} @variables={{this.variables}} @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="templated-input-group-title"]').hasText('Title');
    });

    test('Required field title is properly displayed', async function (assert) {
      await render(
        hbs`<Utils::TemplatedInputGroup @title={{this.title}} @value={{this.value}} @variables={{this.variables}} @onChange={{this.onChange}} @required={{true}} />`
      );
      assert.dom('[data-control-name="templated-input-group-title"]').hasText('Title *');
    });

    test('Subtitle is displayed', async function (assert) {
      await render(
        hbs`<Utils::TemplatedInputGroup @title={{this.title}} @subtitle={{this.subtitle}} @value={{this.value}} @variables={{this.variables}} @onChange={{this.onChange}} @required={{true}} />`
      );
      assert.dom('[data-control-name="templated-input-group-subtitle"]').containsText('Subtitle');
    });

    test('Placeholder is displayed', async function (assert) {
      await render(
        hbs`<Utils::TemplatedInputGroup @title={{this.title}} @subtitle={{this.subtitle}} @placeholder={{this.placeholder}} @value={{this.value}} @variables={{this.variables}} @onChange={{this.onChange}} @required={{true}} />`
      );
      assert.dom('input').hasProperty('placeholder', 'Placeholder');
    });
  });

  module('Dropdown variables list', () => {
    hooks.beforeEach(function () {
      this.onChange = (value: string) => {
        this.set('value', value);
      };
    });

    test('Dropdown variables list is opened on click on link', async function (assert) {
      await render(
        hbs`<Utils::TemplatedInputGroup @title={{this.title}} @value={{this.value}} @variables={{this.variables}} @onChange={{this.onChange}} />`
      );
      assert.dom('.upf-floating-menu--hidden').exists();
      assert.dom('.upf-floating-menu--visible').doesNotExist();

      await click('[data-control-name="templated-input-group-insert-variable-link"]');
      assert.dom('.upf-floating-menu--hidden').doesNotExist();
      assert.dom('.upf-floating-menu--visible').exists();
    });

    test('Dropdown variables are correctly displayed', async function (assert) {
      await render(
        hbs`<Utils::TemplatedInputGroup @title={{this.title}} @value={{this.value}} @variables={{this.variables}} @onChange={{this.onChange}} />`
      );

      await click('[data-control-name="templated-input-group-insert-variable-link"]');
      assert.dom('.upf-floating-menu--visible .upf-floating-menu__item').exists({ count: 2 });
      assert.dom('.upf-floating-menu--visible').hasText('Instagram username Tiktok username');
    });

    test('Dropdown variables list is opened when {{ is typed in input', async function (assert) {
      await render(
        hbs`<Utils::TemplatedInputGroup @title={{this.title}} @value={{this.value}} @variables={{this.variables}} @onChange={{this.onChange}} />`
      );

      await typeIn('.upf-input', '{{', { delay: 0 });
      assert.dom('.upf-floating-menu--visible').exists();
    });

    test('Clicking on an item in dropdown closes it and updates input value', async function (assert) {
      this.onChange = sinon.stub().callsFake((value) => {
        this.set('value', value);
      });

      await render(
        hbs`<Utils::TemplatedInputGroup @title={{this.title}} @value={{this.value}} @variables={{this.variables}} @onChange={{this.onChange}} />`
      );

      await click('[data-control-name="templated-input-group-insert-variable-link"]');
      await click('.upf-floating-menu__item:nth-child(1)');
      assert.dom('.upf-floating-menu--hidden').exists('Item selected, dropdown closed');
      assert.ok(this.onChange.calledOnceWithExactly('{{InstagramUsername}}', true));
    });
  });

  module('Error handling', () => {
    test('Variables errors are triggered', async function (assert) {
      this.onChange = sinon.stub().callsFake((value) => {
        this.set('value', value);
      });

      await render(
        hbs`<Utils::TemplatedInputGroup @title={{this.title}} @value={{this.value}} @variables={{this.variables}} @onChange={{this.onChange}} />`
      );

      await typeIn('.upf-input', '{{Random}}', { delay: 0 });
      await click('.fx-row');
      assert.ok(this.onChange.calledWithExactly('{{Random}}', false), 'Variable does not exist');
    });

    test('When multiple variables are typed, only the last one is kept', async function (assert) {
      this.onChange = sinon.stub().callsFake((value) => {
        this.set('value', value);
      });

      await render(
        hbs`<Utils::TemplatedInputGroup @title={{this.title}} @value={{this.value}} @variables={{this.variables}} @onChange={{this.onChange}} />`
      );

      await typeIn('.upf-input', 'test1{{InstagramUsername}}test2{{TiktokUsername}}test3', { delay: 0 });
      assert.ok(this.onChange.calledWithExactly('test1test2{{TiktokUsername}}test3', true));
    });

    test('Feedback message from parent component is handled', async function (assert) {
      this.feedbackMessage = { type: 'error', value: 'Error coming from parent' };

      await render(
        hbs`<Utils::TemplatedInputGroup @title={{this.title}} @value={{this.value}} @variables={{this.variables}} @onChange={{this.onChange}} @feedbackMessage={{this.feedbackMessage}} />`
      );

      await typeIn('.upf-input', 'Testing feedback message', { delay: 0 });
      await click('[data-control-name="templated-input-group-insert-variable-link"]');
      assert.dom('.font-color-error-500').hasText('Error coming from parent');
    });
  });
});
