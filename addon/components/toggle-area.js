import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  classNames: ['__toggle-area'],
  classNameBindings: ['value:toggled'],
  value: false,

  click() {
    this.toggleProperty('value');

    if(this.get('callbackAction')) {
      this.send('runCallback');
    }

    return false; // Don't propagate the event any further
  },

  actions: {
    runCallback: function() {
      this.get('_targetObject').send(this.get('callbackAction'));
    }
  }
});
