import { clearRender, click, find, render, settled } from '@ember/test-helpers';

import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

const DISABLE_SCROLLING = 'disable-scrolling';

module('Integration | Component | layout/side-hover-panel', (hooks) => {
  setupRenderingTest(hooks);

  hooks.afterEach(() => {
    document.body.classList.remove(DISABLE_SCROLLING);
  });

  module('Default rendering', () => {
    test('It renders the panel wrapper', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel>Panel content</Layout::SideHoverPanel>`);

      assert.dom('.__side-hover-panel').exists();
    });

    test('It yields its content inside the hover panel', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel>Panel content</Layout::SideHoverPanel>`);

      assert.dom('.hover-panel').hasText('Panel content');
    });

    test('It sticks the panel to the right on both axis', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel>Panel content</Layout::SideHoverPanel>`);

      assert.dom('.hover-panel').hasClass('right_side');
      assert.dom('.hover-panel').hasClass('right_align');
    });

    test('It animates the panel', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel>Panel content</Layout::SideHoverPanel>`);

      assert.dom('.hover-panel').hasClass('animate');
    });

    test('It applies the transform once the runloop settles', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel>Panel content</Layout::SideHoverPanel>`);

      assert.dom('.hover-panel').hasClass('right_transform');
    });

    test('It fills the available space', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel>Panel content</Layout::SideHoverPanel>`);

      const panel = find('.hover-panel') as HTMLElement;
      assert.strictEqual(panel.style.width, '100%');
      assert.strictEqual(panel.style.height, '100%');
    });

    test('It keeps the backdrop hidden', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel>Panel content</Layout::SideHoverPanel>`);

      assert.dom('.panel-backdrop').hasClass('hidden');
    });

    test('It does not lay the panel over the content', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel>Panel content</Layout::SideHoverPanel>`);

      assert.dom('.__side-hover-panel').doesNotHaveClass('__side-hover-panel--over-content');
    });

    test('It does not lock the page scrolling', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel>Panel content</Layout::SideHoverPanel>`);

      assert.dom(document.body).doesNotHaveClass(DISABLE_SCROLLING);
    });
  });

  module('Positioning', () => {
    test('It sticks the panel to the given side', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel @side="left">Panel content</Layout::SideHoverPanel>`);

      assert.dom('.hover-panel').hasClass('left_side');
      assert.dom('.hover-panel').hasClass('left_transform');
    });

    test('It aligns the panel to the given edge', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel @stickTo="bottom">Panel content</Layout::SideHoverPanel>`);

      assert.dom('.hover-panel').hasClass('bottom_align');
    });

    test('It applies the given dimensions', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel @width="480px" @height="50vh">Panel content</Layout::SideHoverPanel>`);

      const panel = find('.hover-panel') as HTMLElement;
      assert.strictEqual(panel.style.width, '480px');
      assert.strictEqual(panel.style.height, '50vh');
    });

    test('It lays the panel over the content when requested', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel @isOverContent={{true}}>Panel content</Layout::SideHoverPanel>`);

      assert.dom('.__side-hover-panel').hasClass('__side-hover-panel--over-content');
    });
  });

  module('Animation', () => {
    test('It does not animate the panel when the animation is disabled', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel @shouldAnimate={{false}}>Panel content</Layout::SideHoverPanel>`);

      assert.dom('.hover-panel').doesNotHaveClass('animate');
    });

    test('It still applies the transform when the animation is disabled', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel @shouldAnimate={{false}}>Panel content</Layout::SideHoverPanel>`);

      assert.dom('.hover-panel').hasClass('right_transform');
    });
  });

  module('Backdrop', () => {
    test('It reveals the backdrop when a backdrop action is given', async function (assert) {
      this.backdropAction = sinon.stub();

      await render(
        hbs`<Layout::SideHoverPanel @backdropAction={{this.backdropAction}}>Panel content</Layout::SideHoverPanel>`
      );

      assert.dom('.panel-backdrop').doesNotHaveClass('hidden');
    });

    test('It triggers the backdrop action on click', async function (assert) {
      this.backdropAction = sinon.stub();

      await render(
        hbs`<Layout::SideHoverPanel @backdropAction={{this.backdropAction}}>Panel content</Layout::SideHoverPanel>`
      );
      await click('.panel-backdrop');

      assert.true(this.backdropAction.calledOnce);
    });

    test('It does not fail when the backdrop is clicked without a backdrop action', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel>Panel content</Layout::SideHoverPanel>`);
      await click('.panel-backdrop');

      assert.dom('.panel-backdrop').hasClass('hidden');
    });
  });

  module('Page scrolling', () => {
    test('It locks the page scrolling when requested', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel @disableScrolling={{true}}>Panel content</Layout::SideHoverPanel>`);

      assert.dom(document.body).hasClass(DISABLE_SCROLLING);
    });

    test('It unlocks the page scrolling when the panel is destroyed', async function (assert) {
      await render(hbs`<Layout::SideHoverPanel @disableScrolling={{true}}>Panel content</Layout::SideHoverPanel>`);
      await clearRender();

      assert.dom(document.body).doesNotHaveClass(DISABLE_SCROLLING);
    });

    test('It leaves the page scrolling untouched on destroy when it was not locked', async function (assert) {
      document.body.classList.add(DISABLE_SCROLLING);

      await render(hbs`<Layout::SideHoverPanel>Panel content</Layout::SideHoverPanel>`);
      await clearRender();

      assert.dom(document.body).hasClass(DISABLE_SCROLLING);
    });

    test('It unlocks the page scrolling even though another panel still locks it', async function (assert) {
      this.showFirstPanel = true;

      await render(hbs`
        {{#if this.showFirstPanel}}
          <Layout::SideHoverPanel @disableScrolling={{true}}>First panel</Layout::SideHoverPanel>
        {{/if}}
        <Layout::SideHoverPanel @disableScrolling={{true}}>Second panel</Layout::SideHoverPanel>
      `);

      this.set('showFirstPanel', false);
      await settled();

      assert.dom(document.body).doesNotHaveClass(DISABLE_SCROLLING);
    });
  });
});
