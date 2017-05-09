import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  classNames: ['__toggle-area'],
  classNameBindings: ['value:toggled'],
  icon: 'check',
  value: false,

  click() {
    this.toggleProperty('value');

    if(this.get('callbackAction')) {
      this.sendAction('callbackAction');
    }

    return false; // Don't propagate the event any further
  }
});
