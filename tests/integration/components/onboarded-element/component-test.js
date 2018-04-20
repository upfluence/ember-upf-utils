import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('onboarded-element', 'Integration | Component | onboarded element', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{onboarded-element}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#onboarded-element}}
      template block text
    {{/onboarded-element}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
