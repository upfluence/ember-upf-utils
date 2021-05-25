import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import Service from '@ember/service';
import { click, fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

class SessionServiceStub extends Service {}

module('Integration | Component | u-edit/pdf-upload', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:session', SessionServiceStub);
  });

  test('can not insert pdf if there is no url set', async function (assert) {
    this.displayPDFUpload = true;
    this.insertPDF = () => {};

    await render(hbs`<UEdit::PdfUpload @hidden={{not this.displayPDFUpload}} @insertPDF={{this.insertPDF}} />`);

    assert.dom('.modal.modal--pdf-upload button.upf-btn.upf-btn--primary').hasAttribute('disabled');
  });

  test('an pdf is correctly added via its url in the editor', async function (assert) {
    this.displayPDFUpload = true;
    this.insertPDF = (url) => {
      assert.equal(url, 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    };

    await render(hbs`<UEdit::PdfUpload @hidden={{not this.displayPDFUpload}} @insertPDF={{this.insertPDF}} />`);

    await fillIn(
      '.modal.modal--pdf-upload input.upf-input',
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    );

    assert.dom('.modal.modal--pdf-upload button.upf-btn.upf-btn--primary').hasNoAttribute('disabled');

    await click('.modal.modal--pdf-upload button.upf-btn.upf-btn--primary');

    assert.expect(2);
  });
});
