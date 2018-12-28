import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  classNames: ['split-overlay-area'],
  classNameBindings: [
    'rightToggled:split-overlay-area--right-toggled',
    'leftToggled:split-overlay-area--left-toggled'
  ],

  actions: {
    leftSideClick() {
      this.sendAction('leftClick');
    },

    rightSideClick() {
      this.sendAction('rightClick');
    }
  }
});
