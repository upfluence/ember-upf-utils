import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  classNames: ['__toggle-area'],
  classNameBindings: ['value:toggled'],
  value: false,

  click() {
    this.toggleProperty('value');
    return false; // Don't propagate the event any further
  }
});
