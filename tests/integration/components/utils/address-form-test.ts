import EmberObject from '@ember/object';
import { click, fillIn, findAll, render, triggerEvent, typeIn } from '@ember/test-helpers';

import type { FormInstance } from '@upfluence/oss-components/services/form-manager';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { AutocompleteHandlerServiceMock } from '@upfluence/ember-upf-utils/test-support/services/autocomplete-handler';

module('Integration | Component | utils/address-form', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:autocomplete-handler', AutocompleteHandlerServiceMock);
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
    } as object);

    this.onChange = sinon.stub();
  });

  module('@focus paramter', (hooks) => {
    hooks.beforeEach(function () {
      this.address = EmberObject.create({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        countryCode: '',
        zipcode: '',
        phone: ''
      } as object);
    });

    test('It focuses the first name input when @focus is set to first-name', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @focus="first-name" @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="address-form-first-name"] input').isFocused();
    });

    test('It focuses the last name input when @focus is set to last-name', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @focus="last-name" @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="address-form-last-name"] input').isFocused();
    });

    test('It focuses the address1 input when @focus is set to line1', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @focus="line1" @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="address-form-address1"] input').isFocused();
    });

    test('It focuses the address2 input when @focus is set to line2', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @focus="line2" @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="address-form-address2"] input').isFocused();
    });

    test('It focuses the city input when @focus is set to city', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @focus="city" @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="address-form-city"] input').isFocused();
    });

    test('It focuses the state input when @focus is set to state', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @focus="state" @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="address-form-state"] input').isFocused();
    });

    test('It focuses the zipcode input when @focus is set to zipcode', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @focus="zipcode" @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="address-form-zipcode"] input').isFocused();
    });

    test('It focuses the phone input when @focus is set to phone', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @focus="phone" @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="address-form-phone"] input').isFocused();
    });

    test('it opens the country select when @focus is set to country', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @focus="country" @onChange={{this.onChange}} />`
      );
      assert.dom('.upf-infinite-select').exists();
    });
  });

  test('It renders and calls the onChange action when setting up the component', async function (assert) {
    await render(
      hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}}
                              @onChange={{this.onChange}} />`
    );
    assert.dom('[data-control-name="address-form"]').exists();
    assert.ok(this.onChange.calledOnceWith(this.address, true));
  });

  test('it uses the standardized address labels and placeholders', async function (assert) {
    this.address.countryCode = '';

    await render(
      hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{true}} @useGoogleAutocomplete={{false}} @onChange={{this.onChange}} />`
    );

    const labels = findAll('label').map((label) => label.textContent?.replace('*', '').trim());

    assert.ok(labels.includes('First name'));
    assert.dom('[data-control-name="address-form-first-name"] input').hasAttribute('placeholder', 'e.g., John');
    assert.ok(labels.includes('Last name'));
    assert.dom('[data-control-name="address-form-last-name"] input').hasAttribute('placeholder', 'e.g., Doe');
    assert.dom('[data-control-name="address-form-phone"] input').hasAttribute('placeholder', '(415) 000 0000');
    assert.ok(labels.includes('Address line 1'));
    assert
      .dom('[data-control-name="address-form-address1"] input')
      .hasAttribute('placeholder', 'e.g., 123 Market Street');
    assert.ok(labels.includes('Address line 2'));
    assert
      .dom('[data-control-name="address-form-address2"] input')
      .hasAttribute('placeholder', 'e.g., Apt 4B, Building C');
    assert.dom('[data-control-name="address-form-country"] .upf-input').hasText('Select country');
    assert.ok(labels.includes('City'));
    assert.dom('[data-control-name="address-form-city"] input').hasAttribute('placeholder', 'e.g., San Francisco');
    assert.ok(labels.includes('State/Province'));
    assert.dom('[data-control-name="address-form-state"] input').hasAttribute('placeholder', 'e.g., California');
    assert.ok(labels.includes('Postal code'));
    assert.dom('[data-control-name="address-form-zipcode"] input').hasAttribute('placeholder', 'e.g., 94103');
  });

  module('When a form instance is provided', function () {
    test('an empty phone number reports a required error instead of a format error', async function (assert) {
      this.onFormSetup = (formInstance: FormInstance) => (this.formInstance = formInstance);
      this.address.phone = '';

      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @onFormSetup={{this.onFormSetup}} @usePhoneNumberInput={{true}} @useGoogleAutocomplete={{false}} />`
      );

      assert.false(this.formInstance.validateForm());
      const errors = this.formInstance.getErrors();
      assert.strictEqual(errors['phone.submit']?.kind, 'blank');
      assert.notOk(errors['phone.format.submit']);
    });

    test('it keeps an existing phone value without initializing the phone selector', async function (assert) {
      this.onFormSetup = (formInstance: FormInstance) => (this.formInstance = formInstance);
      const savedPhone = this.address.phone;

      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @onFormSetup={{this.onFormSetup}} @usePhoneNumberInput={{true}} @useGoogleAutocomplete={{false}} @onChange={{this.onChange}} />`
      );

      assert.dom('[data-control-name="address-form-phone"] input').hasValue('');
      assert.strictEqual(this.address.phone, savedPhone);
      assert.true(this.formInstance.validateForm());
    });

    test('it validates required fields on submission and displays inline feedback', async function (assert) {
      this.onFormSetup = (formInstance: FormInstance) => (this.formInstance = formInstance);
      this.address.firstName = '';

      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @onFormSetup={{this.onFormSetup}} @useGoogleAutocomplete={{false}} @onChange={{this.onChange}} />`
      );

      assert.false(this.formInstance.validateForm());
      assert.strictEqual(this.formInstance.getErrors()['firstName.submit']?.message.value, 'This field is required.');
    });

    test('it keeps address line 2 optional', async function (assert) {
      this.onFormSetup = (formInstance: FormInstance) => (this.formInstance = formInstance);
      this.address.address2 = '';

      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @onFormSetup={{this.onFormSetup}} @useGoogleAutocomplete={{false}} />`
      );

      assert.true(this.formInstance.validateForm());
      assert.notOk(this.formInstance.getErrors()['address2.submit']);
    });

    test('it validates short address lines on blur without adding a phone rule to the basic input', async function (assert) {
      this.onFormSetup = (formInstance: FormInstance) => (this.formInstance = formInstance);
      this.address.address1 = 'a';
      this.address.phone = 'ext. 12';

      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @onFormSetup={{this.onFormSetup}} @useGoogleAutocomplete={{false}} @onChange={{this.onChange}} />`
      );
      await triggerEvent('[data-control-name="address-form-address1"] input', 'blur');

      assert.strictEqual(
        this.formInstance.getErrors()['address1.format.blur']?.message.value,
        'Invalid format. Make sure the value is correct.'
      );
      assert.notOk(this.formInstance.getErrors()['phone.format.blur']);
    });

    test('it does not apply the OSS phone format validation to the basic input', async function (assert) {
      this.onFormSetup = (formInstance: FormInstance) => (this.formInstance = formInstance);
      this.address.phone = 'call me';

      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @onFormSetup={{this.onFormSetup}} @useGoogleAutocomplete={{false}} />`
      );
      await triggerEvent('[data-control-name="address-form-phone"] input', 'blur');

      assert.notOk(this.formInstance.getErrors()['phone.format.blur']);
    });

    test('it validates country code length on submission', async function (assert) {
      this.onFormSetup = (formInstance: FormInstance) => (this.formInstance = formInstance);
      this.address.countryCode = 'USA';

      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @onFormSetup={{this.onFormSetup}} @useGoogleAutocomplete={{false}} />`
      );

      assert.false(this.formInstance.validateForm());
      assert.strictEqual(this.formInstance.getErrors()['countryCode.format.submit']?.kind, 'invalid');
    });

    test('it validates postal codes longer than the previous limit on blur', async function (assert) {
      this.onFormSetup = (formInstance: FormInstance) => (this.formInstance = formInstance);
      this.address.zipcode = '1'.repeat(256);

      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @onFormSetup={{this.onFormSetup}} @useGoogleAutocomplete={{false}} />`
      );
      await triggerEvent('[data-control-name="address-form-zipcode"] input', 'blur');

      assert.strictEqual(this.formInstance.getErrors()['zipcode.format.blur']?.kind, 'invalid');
    });

    test('it clears a field error when the user starts typing in that field', async function (assert) {
      this.onFormSetup = (formInstance: FormInstance) => (this.formInstance = formInstance);
      this.address.firstName = '';
      this.address.address1 = 'a';

      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @onFormSetup={{this.onFormSetup}} @useGoogleAutocomplete={{false}} />`
      );

      await triggerEvent('[data-control-name="address-form-address1"] input', 'blur');
      await triggerEvent('form', 'submit');
      assert.ok(this.formInstance.getErrors()['firstName.submit']);
      assert.dom('[data-control-name="address-form-first-name"] + span').hasText('This field is required.');

      await typeIn('[data-control-name="address-form-first-name"] input', 'J', { delay: 0 });
      assert.notOk(this.formInstance.getErrors()['firstName.submit']);
      assert.dom('[data-control-name="address-form-first-name"] + span').doesNotExist();

      await typeIn('[data-control-name="address-form-address1"] input', 'b', { delay: 0 });
      assert.notOk(this.formInstance.getErrors()['address1.submit']);
    });
  });

  module('When form callbacks are provided', function () {
    test('it creates a form instance and forwards its submit result', async function (assert) {
      this.onFormSetup = sinon.stub();
      this.onFormSubmit = sinon.stub();

      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @onFormSetup={{this.onFormSetup}} @onFormSubmit={{this.onFormSubmit}} @useGoogleAutocomplete={{false}} />`
      );

      const formInstance = this.onFormSetup.firstCall.args[0];
      assert.ok(formInstance);
      assert.true(formInstance.validateForm());
      assert.deepEqual(formInstance.getErrors(), {});

      await triggerEvent('form', 'submit');
      assert.ok(this.onFormSubmit.calledWith(true));
    });
  });

  test('onChange action is called with truthy validity check when all fields are filled', async function (assert) {
    await render(
      hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @onChange={{this.onChange}} />`
    );

    await typeIn('[data-control-name="address-form-city"] input', 'f', {
      delay: 0
    });
    await click('[data-control-name="address-form-state"] .upf-input');
    await click('[data-control-name="address-form-state"] .upf-infinite-select__item:nth-child(1)');
    assert.ok(this.onChange.calledWith(this.address, true));
  });

  module('Phone number input', function () {
    test('It is hidden if @hidePhoneNumber is truthy', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @hidePhoneNumber={{true}} @useGoogleAutocomplete={{false}}
                                @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="address-form-phone"]').doesNotExist();
    });

    test('It displays the nice phone number input if the right arg is passed', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{true}} @useGoogleAutocomplete={{false}}
                                @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="address-form-phone"]').hasClass('phone-number-container');
    });

    test('It displays a basic input field for the phone number if the dedicated arg is falsy', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{false}} @useGoogleAutocomplete={{false}}
                                @onChange={{this.onChange}} />`
      );
      assert.dom('[data-control-name="address-form-phone"]').hasClass('oss-input-container');
    });

    test('it preserves the stored phone value in the basic input', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{false}} @useGoogleAutocomplete={{false}}
                                @onChange={{this.onChange}} />`
      );

      assert.dom('[data-control-name="address-form-phone"] input').hasValue('+3348408934');
    });

    test('phone input format errors are added to the form feedback', async function (assert) {
      this.onFormSetup = (formInstance: FormInstance) => (this.formInstance = formInstance);
      this.address.phone = '';

      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @onFormSetup={{this.onFormSetup}} @onChange={{this.onChange}} @useGoogleAutocomplete={{false}}
                                @usePhoneNumberInput={{true}} />`
      );
      await typeIn('[data-control-name="address-form-phone"] input', '+8', {
        delay: 0
      });
      await triggerEvent('[data-control-name="address-form-phone"] input', 'blur');
      assert.ok(this.onChange.calledWith(this.address, false));
      assert.strictEqual(this.formInstance.getErrors()['phone.format.blur']?.kind, 'invalid');
    });
  });

  module('If selected country has provinces/states linked', () => {
    test('The state field is mandatory', async function (assert) {
      this.address.state = null;
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @onChange={{this.onChange}} />`
      );

      await click('[data-control-name="address-form-country"] .upf-input');
      await click('[data-control-name="address-form-country"] .upf-infinite-select__item:nth-child(1)');
      assert.ok(this.onChange.firstCall.calledWith(this.address, false));

      await click('[data-control-name="address-form-state"] .upf-input');
      await click('[data-control-name="address-form-state"] .upf-infinite-select__item:nth-child(1)');
      assert.ok(this.onChange.lastCall.calledWith(this.address, true));
    });

    test('The state field is a dropdown with the provinces/states linked to the country', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @onChange={{this.onChange}} />`
      );

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
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @onChange={{this.onChange}} />`
      );

      await click('[data-control-name="address-form-country"] .upf-input');
      await click('[data-control-name="address-form-country"] .upf-infinite-select__item:nth-child(1)');

      await click('[data-control-name="address-form-state"] .upf-input');
      await click('[data-control-name="address-form-state"] .upf-infinite-select__item:nth-child(1)');

      assert.strictEqual(this.address.state, 'Alabama');
    });

    test('when all fields and country & province/state are filled, the onChange action is called with truthy validity', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @onChange={{this.onChange}} />`
      );

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

    test('when all fields are filled and @hidePhoneNumber is true, the onChange action is called with truthy validity', async function (assert) {
      this.address.phone = null;
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @hidePhoneNumber={{true}}
                                @onChange={{this.onChange}} />`
      );

      await fillIn('[data-control-name="address-form-first-name"] > input', 'John');
      await fillIn('[data-control-name="address-form-last-name"] > input', 'Marston');
      await fillIn('[data-control-name="address-form-address1"] > input', '12 Foo bar');
      await fillIn('[data-control-name="address-form-address2"] > input', 'Apt B');
      await fillIn('[data-control-name="address-form-city"] > input', 'Blackwater');
      await click('[data-control-name="address-form-country"] .upf-input');
      await click('[data-control-name="address-form-country"] .upf-infinite-select__item:nth-child(1)');
      await fillIn('[data-control-name="address-form-zipcode"] > input', '3920392');
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
        hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{true}} @useGoogleAutocomplete={{false}}
                                @onChange={{this.onChange}} />`
      );
      await click('[data-control-name="address-form-country"] .upf-input');
      await click('[data-control-name="address-form-country"] .upf-infinite-select__item:nth-child(2)');
      assert.dom('[data-control-name="address-form-state"] .country-selector-container').doesNotExist();
      assert.dom('[data-control-name="address-form-state"]').hasClass('oss-input-container');
    });

    test('onChange action is called with truthy validity check when all fields but the state are filled as it is optional', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{true}} @useGoogleAutocomplete={{false}}
                                @onChange={{this.onChange}} />`
      );
      await click('[data-control-name="address-form-country"] .upf-input');
      await click('[data-control-name="address-form-country"] .upf-infinite-select__item:nth-child(2)');
      assert.dom('[data-control-name="address-form-state"] input').hasValue('');

      assert.ok(this.onChange.lastCall.calledWith(this.address, true));
    });

    test('onChange action is called with truthy validity check when all fields are filled', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{true}} @useGoogleAutocomplete={{false}}
                                @onChange={{this.onChange}} />`
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
      hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{true}} @useGoogleAutocomplete={{false}}
                              @onChange={{this.onChange}} />`
    );

    assert.dom('[data-control-name="address-form-country"] .upf-input').hasText('United States');
  });

  test('When @useGoogleAutocomplete is true, it renders the google autocomplete input', async function (assert) {
    await render(
      hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{true}} @useGoogleAutocomplete={{true}}
                              @onChange={{this.onChange}} />`
    );

    assert.dom('.autocomplete-input-container[data-control-name="address-form-address1"]').exists();
  });

  module('When @hideNameAttrs is true', () => {
    test('It hides the first name input', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{true}} @useGoogleAutocomplete={{false}}
                                @hideNameAttrs={{true}} @onChange={{this.onChange}} />`
      );

      assert.dom('[data-control-name="address-form-first-name"] input').doesNotExist();
    });

    test('It hides the last name input', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @usePhoneNumberInput={{true}} @useGoogleAutocomplete={{false}}
                                @hideNameAttrs={{true}} @onChange={{this.onChange}} />`
      );

      assert.dom('[data-control-name="address-form-last-name"] input').doesNotExist();
    });

    test('When all fields are filled, the @onChange action is called with truthy validity', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @hideNameAttrs={{true}}
                                @onChange={{this.onChange}} />`
      );

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

  module('When @addressKey is defined', (hooks) => {
    hooks.beforeEach(function () {
      this.address = EmberObject.create({
        firstName: 'iam',
        lastName: 'groot',
        line1: 'iam',
        line2: 'groot',
        city: 'foo',
        state: 'groot',
        countryCode: 'US',
        zipcode: 'iam',
        phone: '+3348408934'
      } as object);
    });

    test('The address line is correctly update', async function (assert) {
      await render(
        hbs`<Utils::AddressForm @address={{this.address}} @useGoogleAutocomplete={{false}} @hideNameAttrs={{true}}
                                @onChange={{this.onChange}} @addressKey="line" />`
      );
      await fillIn('[data-control-name="address-form-address1"] > input', '12 Foo bar');
      await fillIn('[data-control-name="address-form-address2"] > input', 'Apt B');

      assert.strictEqual(this.address.line1, '12 Foo bar');
      assert.strictEqual(this.address.line2, 'Apt B');
    });
  });
});
