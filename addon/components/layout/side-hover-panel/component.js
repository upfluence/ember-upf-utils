import Ember from 'ember';
import layout from './template';
let $ = Ember.$;

export default Ember.Component.extend({
  layout,
  classNames: ['__side-hover-panel'],
  
  // Those are the parameters that you can override
  backdropAction: null,
  side: "right",
  shouldAnimate: true,
  width: "100%",
  height: "100%",
  disableScrolling: false,
  stickTo: "right",

  didInsertElement() {
    // limit the amount of work for the brower
    this.$().detach().prependTo($(document.body));


    let hover_panel = this.$('.hover-panel');

    hover_panel.addClass(this.get('side') + "_side");
    hover_panel.addClass(this.get('stickTo') + "_align");

    // Set animationsaddClass
    if (this.get('shouldAnimate') === true)
      hover_panel.addClass('animate');

    // Insert panel
    Ember.run.later(() => {
      hover_panel.addClass(this.get('side') + "_transform");
    });

    // Insert backdrop
    if (this.get('backdropAction') != null)
      this.$('.panel-backdrop').removeClass('hidden');

    // Set panel dimensions
    hover_panel.css({
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
    if (this.get("disableScrolling") === true) {
      $('body').removeClass('prevent-scrolling');
    }
  },

  actions: {
    sendBackdropAction() {
      this.sendAction('backdropAction');
    }
  }
});
