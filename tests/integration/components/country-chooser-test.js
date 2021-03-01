import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, setupOnerror } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { clickTrigger, selectChoose } from 'ember-power-select/test-support/helpers'

import CountryCodes from '@upfluence/ember-upf-utils/resources/country-codes';

const DROPDOWN_CLASS = '.item-chooser .ember-basic-dropdown';

module('Integration | Component | country-chooser', function(hooks) {
  setupRenderingTest(hooks);

  test('it throws an error if no onCountrySelection action is passed', async function(assert) {
    setupOnerror((err) => {
      assert.equal(
        err.message,
        '[component][country-chooser] Please provide a onCountrySelection action',
        'Throws as an error about missing onCountrySelection action.'
      );
    });

    await render(hbs`<CountryChooser />`);
  });

  test('it displays all of the available countries as options', async function(assert) {
    this.onCountrySelection = () => {};

    await render(hbs`<CountryChooser @onCountrySelection={{this.onCountrySelection}} />`);

    assert.dom(DROPDOWN_CLASS).exists();

    await clickTrigger();

    const options = this.element.querySelectorAll('.ember-power-select-options li');

    assert.equal(options.length, CountryCodes.length);
    assert.equal(options[0].innerHTML.trim(), 'United States of America');
    assert.equal(options[options.length - 1].innerHTML.trim(), 'Costa Rica');
  });

  test('(multiple = false) it correctly initialize and set the country code', async function(assert) {
    this.onCountrySelection = () => {};
    this.countryCode = 'CH';

    await render(
      hbs`
        <CountryChooser
         @onCountrySelection={{this.onCountrySelection}} @multiple={{false}}
         @countryCode={{this.countryCode}} />
      `
    );

    assert.dom(DROPDOWN_CLASS).exists();

    assert.equal(
      this.element.querySelector(
        `${DROPDOWN_CLASS} .ember-power-select-selected-item`
      ).innerHTML.trim(),
      'Switzerland'
    );
  });

  test('(multiple = true) it correctly initialize and set the country codes', async function(assert) {
    this.onCountrySelection = () => {};
    this.countryCodes = ['FR', 'CA'];

    await render(
      hbs`
        <CountryChooser
         @onCountrySelection={{this.onCountrySelection}}
         @countryCodes={{this.countryCodes}} />
      `
    );

    assert.dom(DROPDOWN_CLASS).exists();

    const currentOpts = this.element.querySelectorAll(
      `${DROPDOWN_CLASS} .ember-basic-dropdown-trigger .ember-power-select-multiple-option`
    )

    assert.equal(currentOpts.length, 2);
    assert.true(currentOpts[0].innerHTML.trim().includes('France'))
    assert.true(currentOpts[1].innerHTML.trim().includes('Canada'))
  });


  test('(multiple = false) it correctly calls the onCountrySelection function when selecting a value', async function(assert) {
    this.onCountrySelection = (v) => {
      this.countryCode = v[0].id;
    };
    this.countryCode = 'CA';

    await render(
      hbs`
        <CountryChooser
         @onCountrySelection={{this.onCountrySelection}} @multiple=false
         @countryCode={{this.countryCode}} />
      `
    );

    assert.dom(DROPDOWN_CLASS).exists();

    await selectChoose('.ember-power-select-trigger', 'Egypt');

    assert.equal(this.countryCode, 'EG');
  });

  test('(multiple = true) it correctly calls the onCountrySelection function when selecting a value', async function(assert) {
    this.onCountrySelection = (v) => {
      this.set('countryCodes', v.map((x) => x.id));
    };
    this.countryCodes = ['CA', 'FR'];

    await render(
      hbs`
        <CountryChooser
         @onCountrySelection={{this.onCountrySelection}}
         @countryCodes={{this.countryCodes}} />
      `
    );

    assert.dom(DROPDOWN_CLASS).exists();

    await selectChoose('.ember-power-select-trigger', 'Argentina');

    assert.deepEqual(this.countryCodes, ['CA', 'FR', 'AR']);
  });

  test('it uses the passed labels and placeholder', async function(assert) {
    this.onCountrySelection = () => {};
    this.countryCode = null;

    await render(
      hbs`
        <CountryChooser
         @onCountrySelection={{this.onCountrySelection}} @multiple={{false}}
         @countryCode={{this.countryCode}} @label="Foo Bar"
         @placeholder="Baz Placeholder" />
      `
    );

    assert.dom(DROPDOWN_CLASS).exists();

    assert.equal(
      this.element.querySelector(
        `.country-chooser label`
      ).innerHTML.trim(),
      'Foo Bar'
    );

    assert.equal(
      this.element.querySelector(
        `${DROPDOWN_CLASS} .ember-basic-dropdown-trigger .ember-power-select-placeholder`
      ).innerHTML.trim(),
      'Baz Placeholder'
    );
  });

  test('it correctly handles the dark mode', async function(assert) {
    this.onCountrySelection = () => {};
    this.countryCode = null;

    await render(
      hbs`
        <CountryChooser
         @onCountrySelection={{this.onCountrySelection}} @dark={{true}} />
      `
    );

    assert.dom('.item-chooser').hasClass('item-chooser--dark');
  });
});
