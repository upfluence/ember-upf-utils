import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, typeIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | utils/address-form', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.address = {
      firstName: 'iam',
      lastName: 'groot',
      address1: 'iam',
      address2: 'groot',
      city: '',
      state: 'groot',
      countryCode: 'US',
      zipcode: 'iam',
      phone: '+3348408934'
    };

    this.onChange = sinon.stub();
  });

  test('it renders and calls the onChange action when setting up the component', async function (assert) {
    await render(hbs`<Utils::AddressForm @address={{this.address}} @onChange={{this.onChange}} />`);
    assert.dom('[data-control-name="address-form"]').exists();
    assert.ok(this.onChange.calledOnceWith(this.address, false));
  });

  test('onChange action is called with truthly validity check when all fields are fileld', async function (assert) {
    await render(hbs`<Utils::AddressForm @address={{this.address}} @onChange={{this.onChange}} />`);

    await typeIn('[data-control-name="address-form-city"] input', 'f');
    await settled();
    assert.ok(this.onChange.calledWith(this.address, true));
  });
});
