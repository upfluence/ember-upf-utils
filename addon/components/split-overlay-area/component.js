import Ember from 'ember';
import layout from './template';

const { Component } = Ember;

export default Component.extend({
  layout,
  classNames: ['split-overlay-area'],
  classNameBindings: [
    'rightToggled:split-overlay-area--right-toggled',
    'leftToggled:split-overlay-area--left-toggled'
  ],

  mouseMove(e) {
    if (e.target.className.includes('left-side') ||
        e.target.className.includes('fa-close')) {
      this.$('.right-side').addClass('right-side--neutral');
      this.$('.left-side').removeClass('left-side--neutral');
    } else if (e.target.className.includes('right-side') ||
               e.target.className.includes('fa-check')) {
      this.$('.left-side').addClass('left-side--neutral');
      this.$('.right-side').removeClass('right-side--neutral');
    }
  },

  mouseLeave(e) {
    this.$('.right-side').removeClass('right-side--neutral');
    this.$('.left-side').removeClass('left-side--neutral');
  },

  actions: {
    leftSideClick() {
      this.sendAction('leftClick');
    },

    rightSideClick() {
      this.sendAction('rightClick');
    }
  }
});
