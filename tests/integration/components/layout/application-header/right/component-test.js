import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('layout/application-header/right', 'Integration | Component | layout/application header/right', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{layout/application-header/right}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#layout/application-header/right}}
      template block text
    {{/layout/application-header/right}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
