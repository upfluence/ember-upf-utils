import Ember from 'ember';
import layout from './template';
let $ = Ember.$;

export default Ember.Component.extend({
  layout,
  classNames: ['__side-hover-panel'],
  
  // Those are the parameters that you can override
  backdropAction: null,
  side: "right",
  shouldAnimate: "true",
  width: "100%",
  height: "100%",
  disableScrolling: "false",
  stickTo: "right",

  didInsertElement() {
    // limit the amount of work for the brower
    this.$().detach().prependTo($(document.body));
    this.$('.hover-panel').addClass(this.get('side') + "_side");
    this.$('.hover-panel').addClass(this.get('stickTo') + "_align");

    // Set animations
    if (this.get('shouldAnimate') === "true")
      this.$('.hover-panel')
        .css('transition', 'transform .35s cubic-bezier(.25,.8,.25,1)');

    // Insert panel
    Ember.run.later(() => {
      this.$('.hover-panel').addClass(this.get('side') + "_transform");
    });

    // Insert backdrop
    if (this.get('backdropAction') != null)
      this.$('.panel-backdrop').removeClass('hidden');

    // Set panel dimensions
    this.$('.hover-panel').css('width', this.get('width'));
    this.$('.hover-panel').css('height', this.get('height'));

    // Disable scrolling
    if (this.get("disableScrolling") === "true") {
      $('body').css('height', '100%');
      $('body').css('overflow', 'hidden');
    }
  },

  willDestroyElement() {
    // Re-enable scrolling
    if (this.get("disableScrolling") === "true")
    {
      $('body').css('height', 'auto');
      $('body').css('overflow', 'auto');
    }
  },

  actions: {
    backdropAction() {
      this.get('backdropAction')();
    }
  }
});
