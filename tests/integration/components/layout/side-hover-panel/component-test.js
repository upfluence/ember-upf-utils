import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('layout/side-hover-panel', 'Integration | Component | layout/side hover panel', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{layout/side-hover-panel}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#layout/side-hover-panel}}
      template block text
    {{/layout/side-hover-panel}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
