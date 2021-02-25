import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, setupOnerror } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | country-chooser', function(hooks) {
  setupRenderingTest(hooks);

  test('it throws an error if no onCountrySelection action is passed', async function(assert) {
    setupOnerror(() => {
      assert.throws(function() {
        throw new Error('[component][country-chooser] Please provide a onCo')
      }, 'Throws as an error about missing onCountrySelection action.');
    });

    await render(hbs`<CountryChooser />`);
  });
});
