import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupIntl } from 'ember-intl/test-support';
import EmberObject from '@ember/object';
import { render, typeIn } from '@ember/test-helpers';
import sinon from 'sinon';

module('Integration | Component | utils/address-inline', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.address = EmberObject.create({
      address: '123 Main St',
      resolved_address: null
    });
    this.onChange = sinon.stub();
  });

  module('when @useGoogleAutocomplete is false', () => {
    test('It renders', async function (assert) {
      await render(
        hbs`<Utils::AddressInline @value={{this.address}} @useGoogleAutocomplete={{false}}
                              @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="address-inline"]').exists();
    });

    test('It renders the correct address', async function (assert) {
      await render(
        hbs`<Utils::AddressInline @value={{this.address}} @useGoogleAutocomplete={{false}}
                              @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="address-inline"] .upf-input').hasValue('123 Main St');
    });

    test('when type in value, it calls the @onChange', async function (assert) {
      await render(
        hbs`<Utils::AddressInline @value={{this.address}} @useGoogleAutocomplete={{false}}
                              @onChange={{this.onChange}} />`
      );
      await typeIn('[data-control-name="address-inline"] .upf-input', 'reet', { delay: 0 });
      assert.equal(this.onChange.callCount, 4);
      assert.true(this.onChange.lastCall.calledWith({ address: '123 Main Street', resolved_address: null }));
    });
  });

  test('when @useGoogleAutocomplete is true, it renders the google autocomplete input', async function (assert) {
    await render(
      hbs`<Utils::AddressInline @value={{this.address}} @useGoogleAutocomplete={{true}}
                              @onChange={{this.onChange}} />`
    );
    assert.dom('.google-autocomplete-input-container[data-control-name="address-inline"]').exists();
  });
});
