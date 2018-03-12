import Ember from 'ember';
import layout from './template';

const { Component } = Ember;

export default Component.extend({
  layout,
  classNames: ['split-overlay-area'],
  classNameBindings: [
    'rightToggled:split-overlay-area--right-toggled',
    'leftToggled:split-overlay-area--left-toggled'
  ],

  actions: {
    leftSideClick() {
      console.log('clicked on left side');
      this.sendAction('leftClick');
    },

    rightSideClick() {
      console.log('clicked on right side');
      this.sendAction('rightClick');
    }
  }
});
