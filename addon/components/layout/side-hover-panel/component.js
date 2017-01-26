import Ember from 'ember';
import layout from './template';
let $ = Ember.$;

export default Ember.Component.extend({
  layout,
  classNames: ['__side-hover-panel', 'hidden'],
  
  // Those are the parameters that you can override
  backdropAction: null,
  side: "right",
  shouldAnimate: "true",
  width: "100%",
  height: "100%",
  disableScrolling: "false",

  didInsertElement() {
    // limit the amount of work for the brower
    this.$().detach().prependTo($(document.body));

    // Set animations
    if (this.get('shouldAnimate') == "true")
      this.$('.hover-panel')
        .css('transition', 'transform .35s cubic-bezier(.25,.8,.25,1)');

    // Insert panel
    Ember.run.later(() => {
      this.$().removeClass('hidden');
      this.setSide();
    });

    // Insert backdrop
    if (this.get('backdropAction') != null)
      this.$('.panel-backdrop').removeClass('hidden');

    // Set panel dimensions
    this.$('.hover-panel').css('width', this.get('width'));
    this.$('.hover-panel').css('height', this.get('height'));

    // Disable scrolling
    if (this.get("disableScrolling") === "false") {
      $('body').css('height', '100%');
      $('body').css('overflow', 'hidden');
    }
  },

  willDestroyElement() {
    // Re-enable scrolling
    if (this.get("disableScrolling") === "false")
    {
      $('body').css('height', 'auto');
      $('body').css('overflow', 'auto');
    }
  },

  setSide() {
    this.$('.hover-panel').addClass(this.get('side'));
  },

  actions: {
    backdropAction() {
      this.get('backdropAction')();
    }
  }
});
