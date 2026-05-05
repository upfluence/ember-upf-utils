import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import moment from 'moment';

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
      assert.dom('.smart-conversation-message--collapsed').doesNotExist();
      assert.dom('.smart-conversation-message .content').hasText('Gimme, gimme, gimme a creator after midnight');
      assert.dom('.smart-conversation-message span.font-color-gray-400').hasText('05/05/2026, 00:00');
    });

    test('it is not collapsible at all', async function (assert) {
      await render(
        hbs`<Utils::SmartConversation::Message @type={{this.type}} @value={{this.value}} @timestamp={{this.timestamp}}/>`
      );

      assert.dom('.smart-conversation-message--collapsed').doesNotExist();

      await click('.smart-conversation-message');
      assert.dom('.smart-conversation-message--collapsed').doesNotExist();
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
      assert.dom('.smart-conversation-message').hasClass('smart-conversation-message--collapsed');
      assert.dom('.smart-conversation-message .content').hasText(this.value);
      assert.dom('.smart-conversation-message span.font-color-gray-400').hasText('22/04/2026, 00:00');
    });

    test('it toggles collapsed state on click', async function (assert) {
      await render(
        hbs`<Utils::SmartConversation::Message @type={{this.type}} @value={{this.value}} @timestamp={{this.timestamp}}/>`
      );

      assert.dom('.smart-conversation-message--collapsed').exists();

      await click('.smart-conversation-message');
      assert.dom('.smart-conversation-message--collapsed').doesNotExist();

      await click('.smart-conversation-message');
      assert.dom('.smart-conversation-message--collapsed').exists();
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
});
