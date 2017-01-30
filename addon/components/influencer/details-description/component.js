import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['details-description'],

  actions: {
    close() {
      this.sendAction('escAction');
    }
  }
});
