import Ember from 'ember';
import layout from '../templates/components/modal-view';

export default Ember.Component.extend({
  layout,
  classNames: ['modal', 'fade'],
  attributeBindings: ['tabindex'],
  tabindex: -1,
  exitHandled: false,

  didInsertElement() {
    this.$().modal({ keyboard: true, backdrop: 'static' });
    this.$().on('hide.bs.modal', () => {
      this.set('exitHandled', true);
      this.sendAction('closeAction');
    });
  },
  willDestroyElement() {
    if (!this.get('exitHandled')) {
      this.$(this.element).modal('hide');
    }
  }
});
