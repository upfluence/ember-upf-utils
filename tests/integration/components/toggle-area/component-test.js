import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('toggle-area', 'Integration | Component | toggle area', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{toggle-area}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#toggle-area}}
      template block text
    {{/toggle-area}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
