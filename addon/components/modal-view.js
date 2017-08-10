import Ember from 'ember';
import layout from '../templates/components/modal-view';

export default Ember.Component.extend({
  layout,
  classNames: ['modal', 'fade', 'test'],

  didInsertElement() {
    this.$(this.element).modal({keyboard: true, backdrop: 'static'});
  },
  willDestroyElement() {
    this.$(this.element).modal('hide');
  }
});
