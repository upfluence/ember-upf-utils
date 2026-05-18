import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import moment from 'moment';

const LONG_VALUE = 'Lorem ipsum dolor sit amet, '.repeat(100);
const SHORT_VALUE = 'Short message';

module('Integration | Component | utils/smart-conversation/message', function (hooks) {
  setupRenderingTest(hooks);

  module('User prompt', function (hooks) {
    hooks.beforeEach(function () {
      this.type = 'user_prompt';
      this.value = 'Gimme, gimme, gimme a creator after midnight';
      this.timestamp = moment('2026-05-05').valueOf();
    });

    test('it renders properly', async function (assert) {
      await render(
        hbs`<Utils::SmartConversation::Message @type={{this.type}} @value={{this.value}} @timestamp={{this.timestamp}}/>`
      );

      assert.dom('.smart-conversation-message').exists();
      assert.dom('.smart-conversation-message').hasClass('smart-conversation-message--user_prompt');
      assert.dom('.smart-conversation-message .content').hasText('Gimme, gimme, gimme a creator after midnight');
      assert.dom('.smart-conversation-message span.font-color-gray-400').hasText('05/05/2026, 00:00');
    });

    test('the extra-content named block is rendered when provided', async function (assert) {
      await render(
        hbs`
          <Utils::SmartConversation::Message @type={{this.type}} @value={{this.value}} @timestamp={{this.timestamp}}>
            <:extra-content>
              <div class="extra-content">Extra content</div>
            </:extra-content>
          </Utils::SmartConversation::Message>
        `
      );

      assert.dom('.extra-content').exists();
      assert.dom('.extra-content').hasText('Extra content');
    });
  });

  module('Smart reply', function (hooks) {
    hooks.beforeEach(function () {
      this.type = 'smart_reply';
      this.value = 'This is a smart reply';
      this.timestamp = moment('2026-04-22').valueOf();
    });

    test('it renders properly', async function (assert) {
      await render(
        hbs`<Utils::SmartConversation::Message @type={{this.type}} @value={{this.value}} @timestamp={{this.timestamp}}/>`
      );

      assert.dom('.smart-conversation-message').exists();
      assert.dom('.smart-conversation-message').hasClass('smart-conversation-message--smart_reply');
      assert.dom('.smart-conversation-message .content').hasText(this.value);
      assert.dom('.smart-conversation-message span.font-color-gray-400').hasText('22/04/2026, 00:00');
    });

    test('the extra-content named block is rendered when provided', async function (assert) {
      await render(
        hbs`
          <Utils::SmartConversation::Message @type={{this.type}} @value={{this.value}} @timestamp={{this.timestamp}}>
            <:extra-content>
              <div class="extra-content">Extra content</div>
            </:extra-content>
          </Utils::SmartConversation::Message>
        `
      );

      assert.dom('.extra-content').exists();
      assert.dom('.extra-content').hasText('Extra content');
    });
  });

  module('Collapsible message', function () {
    ['user_prompt', 'smart_reply'].forEach((type) => {
      module(`when type is ${type}`, function (hooks) {
        hooks.beforeEach(function () {
          this.type = type;
          this.value = LONG_VALUE;
          this.timestamp = moment('2026-05-05').valueOf();
        });

        test('by default, an overflowing message is collapsible', async function (assert) {
          await render(
            hbs`<Utils::SmartConversation::Message @type={{this.type}} @value={{this.value}} @timestamp={{this.timestamp}}/>`
          );

          assert.dom('.smart-conversation-message--collapsed').exists();

          await click('.smart-conversation-message');
          assert.dom('.smart-conversation-message--collapsed').doesNotExist();
        });

        test('when no @collapsible argument is provided, it defaults to true', async function (assert) {
          await render(
            hbs`<Utils::SmartConversation::Message @type={{this.type}} @value={{this.value}} @timestamp={{this.timestamp}}/>`
          );

          assert.dom('.smart-conversation-message--collapsed').exists();
        });

        test('when a falsy @collapsible argument is provided, message is not collapsed', async function (assert) {
          await render(
            hbs`<Utils::SmartConversation::Message @collapsible={{false}} @type={{this.type}} @value={{this.value}} @timestamp={{this.timestamp}}/>`
          );

          assert.dom('.smart-conversation-message--collapsed').doesNotExist();
        });

        test('when a falsy @collapsible argument is provided, message is not collapsible', async function (assert) {
          await render(
            hbs`<Utils::SmartConversation::Message @collapsible={{false}} @type={{this.type}} @value={{this.value}} @timestamp={{this.timestamp}}/>`
          );

          assert.dom('.smart-conversation-message--collapsed').doesNotExist();

          await click('.smart-conversation-message');
          assert.dom('.smart-conversation-message--collapsed').doesNotExist();
        });

        test('when a truthy @collapsible argument is provided, an overflowing message is collapsed', async function (assert) {
          await render(
            hbs`<Utils::SmartConversation::Message @collapsible={{true}} @type={{this.type}} @value={{this.value}} @timestamp={{this.timestamp}}/>`
          );

          assert.dom('.smart-conversation-message--collapsed').exists();
        });

        test('it toggles collapsed state on click when content overflows', async function (assert) {
          await render(
            hbs`<Utils::SmartConversation::Message @type={{this.type}} @value={{this.value}} @timestamp={{this.timestamp}}/>`
          );

          assert.dom('.smart-conversation-message--collapsed').exists();

          await click('.smart-conversation-message');
          assert.dom('.smart-conversation-message--collapsed').doesNotExist();

          await click('.smart-conversation-message');
          assert.dom('.smart-conversation-message--collapsed').exists();
        });

        test('when content fits within max height, message is not visually collapsed', async function (assert) {
          this.value = SHORT_VALUE;

          await render(
            hbs`<Utils::SmartConversation::Message @type={{this.type}} @value={{this.value}} @timestamp={{this.timestamp}}/>`
          );

          assert.dom('.smart-conversation-message--collapsed').doesNotExist();
        });

        test('clicking a non-overflowing message does not toggle collapsed state', async function (assert) {
          this.value = SHORT_VALUE;

          await render(
            hbs`<Utils::SmartConversation::Message @type={{this.type}} @value={{this.value}} @timestamp={{this.timestamp}}/>`
          );

          assert.dom('.smart-conversation-message--collapsed').doesNotExist();

          await click('.smart-conversation-message');
          assert.dom('.smart-conversation-message--collapsed').doesNotExist();
        });
      });
    });
  });
});
