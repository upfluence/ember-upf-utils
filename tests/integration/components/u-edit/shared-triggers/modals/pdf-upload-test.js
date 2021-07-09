import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import Service from '@ember/service';
import { click, fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

class SessionServiceStub extends Service {}

module('Integration | Component | u-edit/shared-triggers/modals/pdf-upload', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:session', SessionServiceStub);
  });

  test('can not insert pdf if there is no url set', async function (assert) {
    this.insertPDF = () => {};

    await render(hbs`<UEdit::SharedTriggers::Modals::ImageUpload @insertFile={{this.insertPDF}} />`);

    assert.dom(document.querySelector('.uedit-file-uploader button.upf-btn.upf-btn--primary')).hasAttribute('disabled');
  });

  test('an image is correctly added via its url in the editor', async function (assert) {
    this.displayImageUpload = true;
    this.insertPDF = (url) => {
      assert.equal(url, 'http://www.africau.edu/images/default/sample.pdf');
    };

    await render(hbs`<UEdit::SharedTriggers::Modals::ImageUpload @insertFile={{this.insertPDF}} />`);
    await fillIn(
      document.querySelector('.uedit-file-uploader input.upf-input'),
      'http://www.africau.edu/images/default/sample.pdf'
    );

    assert
      .dom(document.querySelector('.uedit-file-uploader button.upf-btn.upf-btn--primary'))
      .hasNoAttribute('disabled');

    await click(document.querySelector('.uedit-file-uploader button.upf-btn.upf-btn--primary'));

    assert.expect(2);
  });
});