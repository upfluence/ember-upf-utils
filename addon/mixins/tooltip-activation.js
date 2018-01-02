import Ember from 'ember';

const { Mixin } = Ember;

export default Mixin.create({
  attributeBindings: ['data-toggle', 'data-placement'],

  didRender() {
    this._super();
    this.$('[data-toggle="tooltip"]').tooltip();
  }
});
