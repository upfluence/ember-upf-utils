import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import EmberObject from '@ember/object';
import { click, fillIn, findAll, render, typeIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | utils/address-form', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.address = EmberObject.create({
      firstName: 'iam',
      lastName: 'groot',
      address1: 'iam',
      address2: 'groot',
      city: 'foo',
      state: 'groot',
      countryCode: 'US',
      zipcode: 'iam',
      phone: '+3348408934'
    });

    this.onChange = sinon.stub();
  });

  test('it renders and calls the onChange action when setting up the component', async function (assert) {
    await render(hbs`<Utils::AddressForm @address={{this.address}} @onChange={{this.onChange}} />`);
    assert.dom('[data-control-name="address-form"]').exists();
    assert.ok(this.onChange.calledOnceWith(this.address, true));
  });

  test('onChange action is called with truthy validity check when all fields are filled', async function (assert) {
    await render(hbs`<Utils::AddressForm @address={{this.address}} @onChange={{this.onChange}} />`);

    await typeIn('[data-control-name="address-form-city"] input', 'f');
    await click('[data-control-name="address-form-state"] .upf-input');
    await click('[data-control-name="address-form-state"] .upf-infinite-select__item:nth-child(1)');
    assert.ok(this.onChange.calledWith(this.address, true));
  });

  module('phone number input', function () {
    test('it displays the nice phone number input if the right arg is passed', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{true}} @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="address-form-phone"]').hasClass('phone-number-container');
    });

    test('it displays a basic input field for the phone number if the dedicated arg is falsy', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{false}} @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="address-form-phone"]').hasClass('oss-input-container');
    });

    test('onChange action is called with falsy validity check if the phone number has a double country prefix', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @onChange={{this.onChange}} @usePhoneNumberInput={{true}} />`
      );
      await typeIn('[data-control-name="address-form-phone"] input', '+8');
      assert.ok(this.onChange.calledWith(this.address, false));
    });
  });

  module('If selected country has provinces/states linked', () => {
    test('The state field is mandatory', async function (assert) {
      this.address.state = null;
      await render(hbs`<Utils::AddressForm @address={{this.address}} @onChange={{this.onChange}} />`);

      await click('[data-control-name="address-form-country"] .upf-input');
      await click('[data-control-name="address-form-country"] .upf-infinite-select__item:nth-child(1)');
      assert.ok(this.onChange.firstCall.calledWith(this.address, false));

      await click('[data-control-name="address-form-state"] .upf-input');
      await click('[data-control-name="address-form-state"] .upf-infinite-select__item:nth-child(1)');
      assert.ok(this.onChange.lastCall.calledWith(this.address, true));
    });

    test('The state field is a dropdown with the provinces/states linked to the country', async function (assert) {
      await render(hbs`<Utils::AddressForm @address={{this.address}} @onChange={{this.onChange}} />`);

      await fillIn('[data-control-name="address-form-first-name"] > input', 'John');
      await fillIn('[data-control-name="address-form-last-name"] > input', 'Marston');
      await fillIn('[data-control-name="address-form-address1"] > input', '12 Foo bar');
      await fillIn('[data-control-name="address-form-address2"] > input', 'Apt B');
      await fillIn('[data-control-name="address-form-city"] > input', 'Blackwater');
      await click('[data-control-name="address-form-country"] .upf-input');
      await click('[data-control-name="address-form-country"] .upf-infinite-select__item:nth-child(1)');
      await fillIn('[data-control-name="address-form-zipcode"] > input', '3920392');
      await fillIn('[data-control-name="address-form-phone"] > input', '+4153920392');
      await click('[data-control-name="address-form-state"] .upf-input');

      assert.deepEqual(findAll('[data-control-name="address-form-state"] .upf-infinite-select__item').length, 62);
    });

    test('Clicking on a province/state sets the input to the selected value', async function (assert) {
      await render(hbs`<Utils::AddressForm @address={{this.address}} @onChange={{this.onChange}} />`);

      await click('[data-control-name="address-form-country"] .upf-input');
      await click('[data-control-name="address-form-country"] .upf-infinite-select__item:nth-child(1)');

      await click('[data-control-name="address-form-state"] .upf-input');
      await click('[data-control-name="address-form-state"] .upf-infinite-select__item:nth-child(1)');

      assert.equal(this.address.state, 'Alabama');
    });

    test('when all fields and country & province/state are filled, the onChange action is called with truthy validity', async function (assert) {
      await render(hbs`<Utils::AddressForm @address={{this.address}} @onChange={{this.onChange}} />`);

      await fillIn('[data-control-name="address-form-first-name"] > input', 'John');
      await fillIn('[data-control-name="address-form-last-name"] > input', 'Marston');
      await fillIn('[data-control-name="address-form-address1"] > input', '12 Foo bar');
      await fillIn('[data-control-name="address-form-address2"] > input', 'Apt B');
      await fillIn('[data-control-name="address-form-city"] > input', 'Blackwater');
      await click('[data-control-name="address-form-country"] .upf-input');
      await click('[data-control-name="address-form-country"] .upf-infinite-select__item:nth-child(1)');
      await fillIn('[data-control-name="address-form-zipcode"] > input', '3920392');
      await fillIn('[data-control-name="address-form-phone"] > input', '+4153920392');
      await click('[data-control-name="address-form-state"] .upf-input');
      await click('[data-control-name="address-form-state"] .upf-infinite-select__item:nth-child(1)');

      assert.ok(this.onChange.lastCall.calledWith(this.address, true));
    });
  });

  module('If selected country has no provinces/states linked', function (hooks) {
    hooks.beforeEach(async function () {
      this.address.setProperties({
        firstName: 'iam',
        lastName: 'groot',
        address1: 'iam',
        address2: 'groot',
        city: 'iam',
        zipcode: 'iam',
        phone: '+3348408934'
      });
    });

    test('The state field is an text input', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{true}} @onChange={{this.onChange}} />`
      );
      await click('[data-control-name="address-form-country"] .upf-input');
      await click('[data-control-name="address-form-country"] .upf-infinite-select__item:nth-child(2)');
      assert.dom('[data-control-name="address-form-state"] .country-selector-container').doesNotExist();
      assert.dom('[data-control-name="address-form-state"]').hasClass('oss-input-container');
    });

    test('onChange action is called with truthy validity check when all fields are filled', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{true}} @onChange={{this.onChange}} />`
      );
      await click('[data-control-name="address-form-country"] .upf-input');
      await click('[data-control-name="address-form-country"] .upf-infinite-select__item:nth-child(2)');
      assert.dom('[data-control-name="address-form-state"] input').hasValue('groot');

      assert.ok(this.onChange.lastCall.calledWith(this.address, true));
    });

    test('onChange action is called with truthy validity check when all fields are filled', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{true}} @onChange={{this.onChange}} />`
      );
      await click('[data-control-name="address-form-country"] .upf-input');
      await click('[data-control-name="address-form-country"] .upf-infinite-select__item:nth-child(2)');
      await fillIn('[data-control-name="address-form-state"] input', 'Test');
      assert.dom('[data-control-name="address-form-state"] input').hasValue('Test');
      assert.ok(this.onChange.lastCall.calledWith(this.address, true));
    });
  });

  test('The default country selected is USA', async function (assert) {
    await render(
      hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{true}} @onChange={{this.onChange}} />`
    );

    assert.dom('[data-control-name="address-form-country"] .upf-input').hasText('United States');
  });
});
