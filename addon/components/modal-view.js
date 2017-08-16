import Ember from 'ember';
import layout from '../templates/components/modal-view';

export default Ember.Component.extend({
  layout,
  classNames: ['modal', 'fade'],
  attributeBindings: ['tabindex'],
  tabindex: -1,

  didInsertElement() {
    this.$().modal({ keyboard: true, backdrop: 'static' });
    this.$().on('hide.bs.modal', () => {
      this.triggerAction({ action: 'closeModal' });
    });
  },
  willDestroyElement() {
    this.$(this.element).modal('hide');
  }
});
