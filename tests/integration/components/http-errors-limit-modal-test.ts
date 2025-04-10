import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';
import sinon from 'sinon';
import Service from '@ember/service';

class CSChat extends Service {
  openTicket = sinon.stub();
}
module('Integration | Component | http-errors-limit-modal', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:cs-chat', CSChat);
    this.csChat = this.owner.lookup('service:cs-chat');
    this.routerService = this.owner.lookup('service:router');
    this.transitionToStub = sinon.stub(this.routerService, 'transitionTo');
  });

  test('it renders', async function (assert) {
    await render(hbs`<HttpErrorsLimitModal />`);

    assert.dom('.oss-modal-dialog').exists();
    assert.dom('.oss-modal-dialog button').exists({ count: 2 });
    assert.dom('.oss-modal-dialog button:nth-of-type(1)').hasText(this.intl.t('errors.402.limit_exceeded.go_back'));
    assert.dom('.oss-modal-dialog button:nth-of-type(1)').hasClass('upf-btn--default');
    assert.dom('.oss-modal-dialog button:nth-of-type(2)').hasText(this.intl.t('errors.402.limit_exceeded.cta'));
    assert.dom('.oss-modal-dialog button:nth-of-type(2)').hasClass('upf-btn--primary');
  });

  test('clicking on go back button, it triggers a router transitionTo', async function (assert) {
    await render(hbs`<HttpErrorsLimitModal />`);

    assert.ok(this.transitionToStub.notCalled);
    await click('.oss-modal-dialog button:nth-of-type(1)');
    assert.ok(this.transitionToStub.calledOnceWithExactly('facade.lists'));
  });

  test('clicking on go back button, it opens cschat with prefilled message', async function (assert) {
    await render(hbs`<HttpErrorsLimitModal />`);

    assert.ok(this.csChat.openTicket.notCalled);
    await click('.oss-modal-dialog button:nth-of-type(2)');
    assert.ok(this.csChat.openTicket.calledOnceWithExactly(this.intl.t('errors.402.limit_exceeded.email_data.body')));
  });
});
