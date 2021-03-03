import { later } from '@ember/runloop';
import $ from 'jquery';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  classNames: ['__side-hover-panel'],
  classNameBindings: ['isOverContent:__side-hover-panel--over-content'],

  // Those are the parameters that you can override
  backdropAction: null,
  side: 'right',
  shouldAnimate: true,
  width: '100%',
  height: '100%',
  disableScrolling: false,
  stickTo: 'right',

  didInsertElement() {
    this._super(...arguments);
    let hoverPanel = this.$('.hover-panel');
    hoverPanel.addClass(this.side + '_side');
    hoverPanel.addClass(this.stickTo + '_align');

    // Set animationsaddClass
    if (this.shouldAnimate === true) {
      hoverPanel.addClass('animate');
    }

    // Insert panel
    later(() => {
      hoverPanel.addClass(this.side + '_transform');
    });

    // Insert backdrop
    if (this.backdropAction != null) {
      this.$('.panel-backdrop').removeClass('hidden');
    }

    // Set panel dimensions
    hoverPanel.css({
      width: this.width,
      height: this.height
    });

    // Disable scrolling
    if (this.disableScrolling === true) {
      $('body').addClass('disable-scrolling');
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    // Re-enable scrolling
    this.$('.hover-panel').remove();
    this.$('.panel-backdrop').addClass('hidden');
    if (this.disableScrolling === true) {
      $('body').removeClass('disable-scrolling');
    }
  },

  actions: {
    sendBackdropAction() {
      this.sendAction('backdropAction');
    }
  }
});
