import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupIntl } from 'ember-intl/test-support';
import { click, fillIn, render, triggerEvent, typeIn, waitFor } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

import MockUploader from '@upfluence/oss-components/test-support/services/uploader';

const FILE: File = new File(
  [new Blob(['iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='])],
  '1px.pdf',
  { type: 'application/pdf' }
);
const URL: string = 'https://www.test.com/sample.pdf';

module('Integration | Component | u-edit/shared-triggers/modals/pdf-upload', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:uploader', MockUploader);
    this.onClose = sinon.stub();
    this.insertImage = sinon.stub();
  });

  test('it renders', async function (assert) {
    await render(
      hbs`<UEdit::SharedTriggers::Modals::PdfUpload @closeAction={{this.onClose}} @insertFile={{this.insertImage}} />`
    );
    assert.dom('.uedit-file-uploader').exists();
  });

  test('the modal title is correct', async function (assert) {
    await render(
      hbs`<UEdit::SharedTriggers::Modals::PdfUpload @closeAction={{this.onClose}} @insertFile={{this.insertImage}} />`
    );
    assert.dom('header .title').hasText('Add PDF');
  });

  test('it calls the @onClose', async function (assert) {
    await render(
      hbs`<UEdit::SharedTriggers::Modals::PdfUpload @closeAction={{this.onClose}} @insertFile={{this.insertImage}} />`
    );
    await click('[data-control-name="close-modal-button"]');
    assert.true(this.onClose.calledOnceWithExactly());
  });

  test('the alert info is rendered', async function (assert) {
    await render(
      hbs`<UEdit::SharedTriggers::Modals::PdfUpload @closeAction={{this.onClose}} @insertFile={{this.insertImage}} />`
    );
    assert.dom('.upf-alert.upf-alert--info').exists();
  });

  module('for the url input', () => {
    test('the placeholder is correct', async function (assert) {
      await render(
        hbs`<UEdit::SharedTriggers::Modals::PdfUpload @closeAction={{this.onClose}} @insertFile={{this.insertImage}} />`
      );
      assert.dom('.upf-input').hasAttribute('placeholder', 'https://example.org/file.pdf');
    });

    test('the primary action is disabled when input is empty', async function (assert) {
      await render(
        hbs`<UEdit::SharedTriggers::Modals::PdfUpload @closeAction={{this.onClose}} @insertFile={{this.insertImage}} />`
      );
      assert.dom('.uedit-file-uploader button.upf-btn.upf-btn--primary').isDisabled();
    });

    test('the @insertImage method is called with correct args', async function (assert) {
      await render(
        hbs`<UEdit::SharedTriggers::Modals::PdfUpload @closeAction={{this.onClose}} @insertFile={{this.insertImage}} />`
      );

      await fillIn('.uedit-file-uploader input.upf-input', URL);
      await click('.uedit-file-uploader button.upf-btn.upf-btn--primary');
      assert.true(this.insertImage.calledOnceWithExactly(URL));
    });
  });

  module('for the uploader', () => {
    test('the primary action is disabled', async function (assert) {
      await render(
        hbs`<UEdit::SharedTriggers::Modals::PdfUpload @closeAction={{this.onClose}} @insertFile={{this.insertImage}} />`
      );
      assert.dom('.uedit-file-uploader button.upf-btn.upf-btn--primary').isDisabled();
    });

    test('the @insertImage method is called with correct args', async function (assert) {
      await render(
        hbs`<UEdit::SharedTriggers::Modals::PdfUpload @closeAction={{this.onClose}} @insertFile={{this.insertImage}} />`
      );
      await triggerEvent('.oss-upload-area', 'drop', {
        dataTransfer: {
          files: [FILE]
        }
      });
      await waitFor('[data-control-name="upload-item-edit-button"]');

      await click('.uedit-file-uploader button.upf-btn.upf-btn--primary');

      assert.true(this.insertImage.calledOnceWithExactly('https://oss-components.upfluence.co/uploader/foo.png'));
    });
  });

  test('the input URL has priority over uploader', async function (assert) {
    await render(
      hbs`<UEdit::SharedTriggers::Modals::PdfUpload @closeAction={{this.onClose}} @insertFile={{this.insertImage}} />`
    );
    await typeIn('.uedit-file-uploader input.upf-input', URL, { delay: 0 });

    await triggerEvent('.oss-upload-area', 'drop', {
      dataTransfer: {
        files: [FILE]
      }
    });
    await waitFor('[data-control-name="upload-item-edit-button"]');
    await click('.uedit-file-uploader button.upf-btn.upf-btn--primary');
    assert.true(this.insertImage.calledOnceWithExactly(URL));
  });
});
