import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | logo-maker', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.onChangeStub = sinon.stub();
    this.icon = 'popcorn';
    this.color = 'pink';
  });

  test('The icon defined in the arg is selected on load', async function (assert) {
    await render(hbs`<LogoMaker @icon={{this.icon}} @color={{this.color}} @onChange={{this.onChangeStub}}/>`);
    assert.dom('.logo-icon--selected .fad.fa-popcorn').exists();
  });

  test('The color defined in the arg is selected on load', async function (assert) {
    await render(hbs`<LogoMaker @icon={{this.icon}} @color={{this.color}} @onChange={{this.onChangeStub}}/>`);

    assert.dom('.logo-icon--selected.logo-icon-color_pink').exists();
    assert.dom('.swatch.swatch--selected').hasClass('logo-swatch-color_pink');
  });

  test('Selecting another icon applies the proper class to the newly selected element', async function (assert) {
    await render(hbs`<LogoMaker @icon={{this.icon}} @color={{this.color}} @onChange={{this.onChangeStub}}/>`);

    assert.dom('.logo-icon--selected .fad.fa-popcorn').exists();
    await click('.logo-icon:nth-of-type(1)');
    assert.dom('.logo-icon--selected .fad.fa-rabbit').exists();
  });

  test('Selecting another color applies the proper class to the newly selected element', async function (assert) {
    await render(hbs`<LogoMaker @icon={{this.icon}} @color={{this.color}} @onChange={{this.onChangeStub}}/>`);

    assert.dom('.logo-icon--selected .fad.fa-popcorn').exists();
    await click('.logo-icon:nth-of-type(1)');
    assert.dom('.logo-icon--selected .fad.fa-rabbit').exists();
  });

  module('@onChange method', function () {
    test('is called when setting a new icon', async function (assert) {
      await render(hbs`<LogoMaker @icon={{this.icon}} @color={{this.color}} @onChange={{this.onChangeStub}}/>`);

      await click('.logo-icon:nth-of-type(1)');
      assert.ok(this.onChangeStub.calledOnceWithExactly('rabbit', 'pink'));
    });

    test('is called when setting a new color', async function (assert) {
      await render(hbs`<LogoMaker @icon={{this.icon}} @color={{this.color}} @onChange={{this.onChangeStub}}/>`);

      assert.dom('.swatch.swatch--selected').hasClass('logo-swatch-color_pink');
      await click('.swatch:nth-of-type(1)');
      assert.ok(this.onChangeStub.calledOnceWithExactly('popcorn', 'stone'));
    });
  });
});
