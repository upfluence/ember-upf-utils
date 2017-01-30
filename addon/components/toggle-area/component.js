import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['__toggle-area'],
  classNameBindings: ['value:toggled'],

  click() {
    this.toggleProperty('value');
    return false; // Don't propagate the event any further
  }
});
