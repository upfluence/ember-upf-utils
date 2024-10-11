import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | logo-maker', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function (val) { ... });

    await render(hbs`<LogoMaker />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <LogoMaker>
        template block text
      </LogoMaker>
    `);

    assert.dom().hasText('template block text');
  });
});
