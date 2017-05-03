import Ember from 'ember';
import layout from '../templates/components/currency-chooser';

export default Ember.Component.extend({
  layout,

  actions: {
    updateCurrency(currency) {
      this.set('value', currency);
    }
  }
});
