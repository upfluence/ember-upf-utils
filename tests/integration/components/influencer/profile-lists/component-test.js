import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('influencer/profile-lists', 'Integration | Component | influencer/profile lists', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{influencer/profile-lists}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#influencer/profile-lists}}
      template block text
    {{/influencer/profile-lists}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
