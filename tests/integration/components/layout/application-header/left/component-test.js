import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('layout/application-header/left', 'Integration | Component | layout/application header/left', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{layout/application-header/left}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#layout/application-header/left}}
      template block text
    {{/layout/application-header/left}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
