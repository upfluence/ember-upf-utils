import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | utils/jace-blob', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.loading = false;
    await render(hbs`<Utils::JaceBlob @loading={{this.loading}}/>`);

    assert.dom('.jace-blob').exists();
  });

  test('the inactive GIF has class fade-in when loading is false', async function (assert) {
    await render(hbs`<Utils::JaceBlob @loading={{this.loading}} />`);

    const images = this.element.querySelectorAll('img');
    const inactiveImg = Array.from(images).find((img: Element) =>
      img.getAttribute('src')?.includes('jace-blob-inactive.gif')
    ) as HTMLImageElement;

    assert.ok(inactiveImg, 'Found the inactive GIF');
    assert.ok(inactiveImg?.classList.contains('fade-in'));
  });

  test('the active GIF has class fade-in when loading is true', async function (assert) {
    this.loading = true;
    await render(hbs`<Utils::JaceBlob @loading={{this.loading}} />`);

    const images = this.element.querySelectorAll('img');
    const active = Array.from(images).find((img: Element) =>
      img.getAttribute('src')?.includes('jace-blob-loading.gif')
    ) as HTMLImageElement;

    assert.ok(active, 'Found the inactive GIF');
    assert.ok(active?.classList.contains('fade-in'));
  });
});
