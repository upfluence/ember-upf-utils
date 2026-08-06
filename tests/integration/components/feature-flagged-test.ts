import Service from '@ember/service';
import { render } from '@ember/test-helpers';

import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

class FeatureFlagsManagerMock extends Service {
  allow = sinon.stub();
}

module('Integration | Component | feature-flagged', (hooks) => {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:feature-flags-manager', FeatureFlagsManagerMock);
    this.featureFlagsManager = this.owner.lookup('service:feature-flags-manager');
    this.allowStub = this.featureFlagsManager.allow;
  });

  module('When the feature is allowed', () => {
    test('It renders the main block', async function (assert) {
      this.allowStub.resolves(true);

      await render(hbs`
        {{#feature-flagged "managed_billing"}}
          <span class="allowed">Allowed content</span>
        {{else}}
          <span class="denied">Denied content</span>
        {{/feature-flagged}}
      `);

      assert.dom('.allowed').hasText('Allowed content');
      assert.dom('.denied').doesNotExist();
    });

    test('It requests the feature passed as a positional parameter', async function (assert) {
      this.allowStub.resolves(true);

      await render(hbs`{{#feature-flagged "managed_billing"}}<span class="allowed">Allowed</span>{{/feature-flagged}}`);

      assert.true(this.allowStub.calledOnceWithExactly('managed_billing'));
    });

    test('It does not wrap the yielded content in an element', async function (assert) {
      this.allowStub.resolves(true);

      await render(hbs`{{#feature-flagged "managed_billing"}}<span class="allowed">Allowed</span>{{/feature-flagged}}`);

      assert.dom(this.element.firstElementChild).hasClass('allowed');
    });
  });

  module('When the feature is denied', () => {
    test('It renders the inverse block', async function (assert) {
      this.allowStub.resolves(false);

      await render(hbs`
        {{#feature-flagged "managed_billing"}}
          <span class="allowed">Allowed content</span>
        {{else}}
          <span class="denied">Denied content</span>
        {{/feature-flagged}}
      `);

      assert.dom('.denied').hasText('Denied content');
    });

    test('It does not render the main block', async function (assert) {
      this.allowStub.resolves(false);

      await render(hbs`
        {{#feature-flagged "managed_billing"}}
          <span class="allowed">Allowed content</span>
        {{else}}
          <span class="denied">Denied content</span>
        {{/feature-flagged}}
      `);

      assert.dom('.allowed').doesNotExist();
    });

    test('It renders nothing when no inverse block is provided', async function (assert) {
      this.allowStub.resolves(false);

      await render(hbs`{{#feature-flagged "managed_billing"}}<span class="allowed">Allowed</span>{{/feature-flagged}}`);

      assert.dom(this.element).hasText('');
    });
  });

  module('While the check is pending', () => {
    test('It renders the inverse block until the manager resolves', async function (assert) {
      this.allowStub.returns(new Promise(() => undefined));

      await render(hbs`
        {{#feature-flagged "managed_billing"}}
          <span class="allowed">Allowed content</span>
        {{else}}
          <span class="denied">Denied content</span>
        {{/feature-flagged}}
      `);

      assert.dom('.denied').hasText('Denied content');
      assert.dom('.allowed').doesNotExist();
    });
  });

  module('Dynamic feature name', () => {
    test('It requests the feature held by a bound property', async function (assert) {
      this.allowStub.resolves(true);
      this.requiredScope = 'analytics_web';

      await render(
        hbs`{{#feature-flagged this.requiredScope}}<span class="allowed">Allowed</span>{{/feature-flagged}}`
      );

      assert.true(this.allowStub.calledOnceWithExactly('analytics_web'));
    });
  });
});
