import Ember from 'ember';
import layout from '../templates/components/modal-view';

const {
  Component,
  observer
} = Ember;

export default Component.extend({
  layout,
  classNames: ['modal', 'fade'],
  attributeBindings: ['tabindex'],

  tabindex: -1,
  toggleable: false,
  hidden: false,

  _: observer('hidden', function() {
    if (this.get('hidden')) {
      this.$().modal('hide');
    } else {
      this.$().modal({ backdrop: 'static' });
    }
  }),

  didInsertElement() {
    if(!this.get('hidden')) {
      this.$().modal({ backdrop: 'static' });
    }

    this.$().keyup((e) => {
      if (e.which === 27) {
        this.closeModal(e);
      }
    });

    this.$('button#close-x').click((e) => this.closeModal(e));
  },

  closeModal(e) {
    e.preventDefault();
    this.sendAction('closeAction');
  },

  willDestroyElement() {
    this.$(this.element).modal('hide');
  }
});
