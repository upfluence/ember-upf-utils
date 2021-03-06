import Component from '@ember/component';

export default Component.extend({
  classNames: ['__toggle-area'],
  classNameBindings: ['value:toggled', 'static:__toggle-area--static'],
  icon: 'check',
  value: false,
  static: false,

  click() {
    if (!this.static) {
      this.toggleProperty('value');

      if (this.callbackAction) {
        this.sendAction('callbackAction');
      }
    }

    return false; // Don't propagate the event any further
  }
});
