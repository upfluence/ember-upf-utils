import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['modal', 'fade'],

  _: Ember.observer('open', function() {
    const mode =  this.get('open') === true ? 'show' : 'hide';
    this.$().modal(mode);
  }),

  didInsertElement() {
    this.$().on('hidden.bs.modal', () => {
      this.set('open', false);
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$().modal('hide');
  }
});
