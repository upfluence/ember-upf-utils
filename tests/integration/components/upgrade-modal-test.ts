import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';
import Service from '@ember/service';
import { setupIntl } from 'ember-intl/test-support';

class CurrentUserMock extends Service {
  fetch = () => {};
}

class CsChatMock extends Service {
  openTicket = sinon.stub();
}

module('Integration | Component | upgrade-modal', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.closeStub = sinon.stub();
    this.hidden = false;

    this.owner.register('service:current-user', CurrentUserMock);
    this.currentUserMockService = this.owner.lookup('service:current-user');
    this.fetchStub = sinon.stub(this.currentUserMockService, 'fetch').resolves({ account_subscriptions: [] });
    this.owner.register('service:cs-chat', CsChatMock);
    this.csChat = this.owner.lookup('service:cs-chat');
    this.router = this.owner.lookup('service:router');
    this.transitionToStub = sinon.stub(this.router, 'transitionTo');
    this.to = '';
  });

  test('if hidden is true, it does not display the modal', async function (assert) {
    this.hidden = true;
    await render(hbs`<UpgradeModal @hidden={{this.hidden}} @closeAction={{this.closeStub}} />`);

    assert.dom('.oss-modal-dialog').doesNotExist();
  });

  test('if hidden is false, it displays the modal', async function (assert) {
    await render(hbs`<UpgradeModal @hidden={{this.hidden}} @closeAction={{this.closeStub}} />`);

    assert.dom('.oss-modal-dialog').exists();
    assert.dom('.oss-modal-dialog header').hasText(this.intl.t('upgrade_modal.title'));

    assert.dom('.oss-modal-dialog .upf-banner .font-color-gray-900').hasText(this.intl.t('upgrade_modal.description'));
    assert
      .dom('.oss-modal-dialog .upf-banner .font-color-gray-500')
      .hasText(this.intl.t('upgrade_modal.details.default'));

    assert.dom('.oss-modal-dialog button').exists({ count: 2 });
    assert.dom('.oss-modal-dialog button:nth-of-type(1)').hasText(this.intl.t('upgrade_modal.cta.cancel'));
    assert.dom('.oss-modal-dialog button:nth-of-type(2)').hasText(this.intl.t('upgrade_modal.cta.contact'));
  });

  module('When "to" arg is set', () => {
    ['monitor', 'bulk_emailing'].forEach((key) => {
      module(key, (hooks) => {
        hooks.beforeEach(function () {
          this.to = key;
        });

        test(`it displays the correct description for "${key}"`, async function (assert) {
          await render(hbs`<UpgradeModal @hidden={{this.hidden}} @to={{this.to}} @closeAction={{this.closeStub}} />`);

          const tmp = document.createElement('DIV');
          tmp.innerHTML = this.intl.t(`upgrade_modal.details.${key}`, { htmlSafe: true });
          assert
            .dom('.oss-modal-dialog .upf-banner .font-color-gray-500')
            .hasText(tmp.textContent || tmp.innerText || '');
          tmp.remove();
        });
      });
    });
  });

  test('When clicking on cancel, it trigger the closeAction', async function (assert) {
    await render(hbs`<UpgradeModal @hidden={{this.hidden}} @closeAction={{this.closeStub}} />`);

    assert.ok(this.closeStub.notCalled);
    await click('.upf-btn.upf-btn--default');
    assert.ok(this.closeStub.calledOnce);
  });

  module('If user has subscription, it can upgrade by himself', (hooks) => {
    hooks.beforeEach(function () {
      this.fetchStub.resolves({ account_subscriptions: [{ id: 1 }] });
    });

    test('Primary action, wording is upgrade', async function (assert) {
      await render(hbs`<UpgradeModal @hidden={{this.hidden}} @closeAction={{this.closeStub}} />`);
      assert.dom('.oss-modal-dialog button:nth-of-type(2)').hasText(this.intl.t('upgrade_modal.cta.upgrade'));
    });

    test('When clicking on "contact", it redirects to billing', async function (assert) {
      await render(hbs`<UpgradeModal @hidden={{this.hidden}} @closeAction={{this.closeStub}} />`);
      assert.ok(this.transitionToStub.notCalled);
      await click('.upf-btn--primary');
      assert.ok(this.transitionToStub.calledOnceWithExactly('settings.accounts.billing'));
    });
  });

  module('If user has no subscription', () => {
    test('When clicking on "contact", it opens cs-chat service', async function (assert) {
      await render(hbs`<UpgradeModal @hidden={{this.hidden}} @closeAction={{this.closeStub}} />`);
      assert.ok(this.csChat.openTicket.notCalled);
      await click('.upf-btn--primary');
      assert.ok(this.csChat.openTicket.calledOnceWithExactly());
    });
  });
});
