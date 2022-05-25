import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import Service from '@ember/service';
import { click, fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

class SessionServiceStub extends Service {}

module('Integration | Component | u-edit/shared-triggers/modals/pdf-upload', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:session', SessionServiceStub);
    this.onClose = sinon.stub();
  });

  test('can not insert pdf if there is no url set', async function (assert) {
    this.insertPDF = () => {};

    await render(
      hbs`<UEdit::SharedTriggers::Modals::PdfUpload @closeAction={{this.onClose}} @insertFile={{this.insertPDF}} />`
    );

    assert.dom('.uedit-file-uploader button.upf-btn.upf-btn--primary').hasAttribute('disabled');
  });

  test('an image is correctly added via its url in the editor', async function (assert) {
    this.displayImageUpload = true;
    this.insertPDF = (url) => {
      assert.equal(url, 'http://www.africau.edu/images/default/sample.pdf');
    };

    await render(
      hbs`<UEdit::SharedTriggers::Modals::PdfUpload @closeAction={{this.onClose}} @insertFile={{this.insertPDF}} />`
    );
    await fillIn('.uedit-file-uploader input.upf-input', 'http://www.africau.edu/images/default/sample.pdf');

    assert.dom('.uedit-file-uploader button.upf-btn.upf-btn--primary').hasNoAttribute('disabled');

    await click('.uedit-file-uploader button.upf-btn.upf-btn--primary');

    assert.expect(2);
  });
});
