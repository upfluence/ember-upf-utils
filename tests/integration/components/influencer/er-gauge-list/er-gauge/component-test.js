import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('influencer/er-gauge-list/er-gauge', 'Integration | Component | influencer/er gauge list/er gauge', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{influencer/er-gauge-list/er-gauge}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#influencer/er-gauge-list/er-gauge}}
      template block text
    {{/influencer/er-gauge-list/er-gauge}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
