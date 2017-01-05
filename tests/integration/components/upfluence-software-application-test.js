import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('upfluence-software-application', 'Integration | Component | upfluence software application', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{upfluence-software-application}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#upfluence-software-application}}
      template block text
    {{/upfluence-software-application}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
