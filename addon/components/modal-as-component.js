import Ember from 'ember';
let $ = Ember.$;

export default Ember.Component.extend({
  classNames: ['modal', 'fade'],

  _: Ember.observer('hidden', function() {
    if (this.get('hidden') === true) {
      $(this.element).modal('hide');
    }
    else {
      $(this.element).modal('show');
    }
  }),

  willDestroyElement() {
    this._super(...arguments);
    $(this.element).modal('hide');
  }
});
