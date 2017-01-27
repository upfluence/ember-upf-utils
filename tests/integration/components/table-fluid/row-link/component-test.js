import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('table-fluid/row-link', 'Integration | Component | table fluid/row link', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{table-fluid/row-link}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#table-fluid/row-link}}
      template block text
    {{/table-fluid/row-link}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
