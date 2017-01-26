import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['__add-item'],

  title: 'Add an item',
  addAction: null,

  click() {
    this.sendAction('addAction');
  }
});
