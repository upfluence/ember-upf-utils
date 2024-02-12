import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
// @ts-ignore
import { setupIntl } from 'ember-intl/test-support';
import sinon from 'sinon';

class CSChat extends Service {
  openTicket = sinon.stub();
}

module('Integration | Component | http-errors-code', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:cs-chat', CSChat);
    this.csChat = this.owner.lookup('service:cs-chat');
  });

  ['404', '500'].forEach((statusCode) => {
    test('it renders w/ the right title & subtitle', async function (assert) {
      this.httpError = statusCode;

      await render(hbs`<HttpErrorsCode @httpError={{this.httpError}} />`);

      assert.dom('[data-control-name="http-error-code-title"]').hasText(this.intl.t(`errors.${statusCode}.title`));
      assert
        .dom('[data-control-name="http-error-code-subtitle"]')
        .hasText(this.intl.t(`errors.${statusCode}.subtitle`));
    });
  });

  test('When 404: the right hints are displayed', async function (assert) {
    await render(hbs`<HttpErrorsCode @httpError="404" />`);
    assert.dom('[data-control-name="http-error-code-hints"] > div').exists({ count: 2 });
    assert.dom('[data-control-name="http-error-code-hints"] > div:first-child i.far').hasClass('fa-unlink');
    assert
      .dom('[data-control-name="http-error-code-hints"] > div:first-child')
      .hasText(this.intl.t('errors.404.hints.url_accuracy_check'));
    assert.dom('[data-control-name="http-error-code-hints"] > div:last-child i.far').hasClass('fa-key');
    assert
      .dom('[data-control-name="http-error-code-hints"] > div:last-child')
      .hasText(this.intl.t('errors.404.hints.authorization_check'));
  });

  test('When 404: the right actions', async function (assert) {
    const redirectStub = sinon.stub(window, 'open');

    await render(hbs`<HttpErrorsCode @httpError="404" />`);
    assert.dom('.upf-btn').exists({ count: 2 });
    assert.dom('.upf-btn.upf-btn--default').exists();
    assert.dom('.upf-btn.upf-btn--default i.far').hasClass('fa-comment');
    assert.dom('.upf-btn.upf-btn--default').hasText(this.intl.t('errors.404.contact_support'));
    assert.dom('.upf-btn.upf-btn--primary').exists();
    assert.dom('.upf-btn.upf-btn--primary i.far').hasClass('fa-arrow-left');
    assert.dom('.upf-btn.upf-btn--primary').hasText(this.intl.t('errors.404.cta'));

    await click('.upf-btn.upf-btn--default');
    assert.ok(this.csChat.openTicket.calledOnceWithExactly(this.intl.t('errors.404.support_message')));
    await click('.upf-btn.upf-btn--primary');
    assert.ok(redirectStub.calledOnceWithExactly('/', '_self'));
    redirectStub.restore();
  });

  test('When 500: the right hints are displayed', async function (assert) {
    await render(hbs`<HttpErrorsCode @httpError="500" />`);

    assert.dom('[data-control-name="http-error-code-hints"] > div').exists({ count: 2 });
    assert.dom('[data-control-name="http-error-code-hints"] > div:first-child i.far').hasClass('fa-bug');
    assert
      .dom('[data-control-name="http-error-code-hints"] > div:first-child')
      .hasText(this.intl.t('errors.500.hints.technical_issue'));
    assert.dom('[data-control-name="http-error-code-hints"] > div:last-child i.far').hasClass('fa-life-ring');
    assert
      .dom('[data-control-name="http-error-code-hints"] > div:last-child')
      .hasText(this.intl.t('errors.500.hints.contact_support'));
  });

  test('When 500: the right actions are displayed', async function (assert) {
    const redirectStub = sinon.stub(window, 'open');

    await render(hbs`<HttpErrorsCode @httpError="500" />`);
    assert.dom('.upf-btn').exists({ count: 2 });
    assert.dom('.upf-btn.upf-btn--default').exists();
    assert.dom('.upf-btn.upf-btn--default i.far').hasClass('fa-comment');
    assert.dom('.upf-btn.upf-btn--default').hasText(this.intl.t('errors.500.contact_support'));
    assert.dom('.upf-btn.upf-btn--primary').exists();
    assert.dom('.upf-btn.upf-btn--primary i.far').hasClass('fa-redo');
    assert.dom('.upf-btn.upf-btn--primary').hasText(this.intl.t('errors.500.cta'));

    await click('.upf-btn.upf-btn--default');
    assert.ok(this.csChat.openTicket.calledOnceWithExactly(this.intl.t('errors.500.support_message')));
    await click('.upf-btn.upf-btn--primary');
    assert.ok(redirectStub.calledOnceWithExactly(location.href, '_self'));
    redirectStub.restore();
  });

  test('When cs-chat button is missing, there is no Contact support button', async function (assert) {
    this.owner.unregister('service:cs-chat');
    await render(hbs`<HttpErrorsCode @httpError="500" />`);
    assert.dom('.upf-btn').exists({ count: 1 });
    assert.dom('.upf-btn.upf-btn--default').doesNotExist();
  });
});
