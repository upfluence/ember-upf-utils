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
  side: "right",
  shouldAnimate: true,
  width: "100%",
  height: "100%",
  disableScrolling: false,
  stickTo: "right",

  didInsertElement() {
    let hoverPanel = this.$('.hover-panel');
    hoverPanel.addClass(this.get('side') + "_side");
    hoverPanel.addClass(this.get('stickTo') + "_align");

    // Set animationsaddClass
    if (this.get('shouldAnimate') === true) {
      hoverPanel.addClass('animate');
    }

    // Insert panel
    later(() => {
      hoverPanel.addClass(this.get('side') + "_transform");
    });

    // Insert backdrop
    if (this.get('backdropAction') != null) {
      this.$('.panel-backdrop').removeClass('hidden');
    }

    // Set panel dimensions
    hoverPanel.css({
        'width': this.get('width'),
        'height': this.get('height')
    });

    // Disable scrolling
    if (this.get("disableScrolling") === true) {
      $('body').addClass('disable-scrolling');
    }
  },

  willDestroyElement() {
    // Re-enable scrolling
    this.$('.hover-panel').remove();
    this.$('.panel-backdrop').addClass('hidden');
    if (this.get("disableScrolling") === true) {
      $('body').removeClass('disable-scrolling');
    }
  },

  actions: {
    sendBackdropAction() {
      this.sendAction('backdropAction');
    }
  }
});
