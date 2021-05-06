import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import Service from '@ember/service';
import { click, fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

class SessionServiceStub extends Service {}

module('Integration | Component | u-edit/image-upload', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:session', SessionServiceStub);
  });

  test('can not insert image if there is no url set', async function (assert) {
    this.displayImageUpload = true;
    this.insertImage = () => {};

    await render(
      hbs`<UEdit::ImageUpload  @hidden={{not this.displayImageUpload}} @insertImage={{this.insertImage}} />`
    );

    assert.dom('.modal.modal--image-upload button.upf-btn.upf-btn--primary').hasAttribute('disabled');
  });

  test('an image is correctly added via its url in the editor', async function (assert) {
    this.displayImageUpload = true;
    this.insertImage = (url) => {
      assert.equal(url, 'https://via.placeholder.com/350x150');
    };

    await render(hbs`
      <UEdit::ImageUpload
       @hidden={{not this.displayImageUpload}} @insertImage={{this.insertImage}} />`);

    await fillIn('.modal.modal--image-upload input.upf-input', 'https://via.placeholder.com/350x150');

    assert.dom('.modal.modal--image-upload button.upf-btn.upf-btn--primary').hasNoAttribute('disabled');

    await click('.modal.modal--image-upload button.upf-btn.upf-btn--primary');

    assert.expect(2);
  });
});
