import Ember from 'ember';
import layout from '../templates/components/modal-view';

export default Ember.Component.extend({
  layout,
  classNames: ['modal', 'fade'],
  attributeBindings: ['tabindex'],
  tabindex: -1,

  didInsertElement() {
    this.$().modal({ backdrop: 'static' });

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
