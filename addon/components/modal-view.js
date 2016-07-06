import Ember from 'ember';
import layout from '../templates/components/modal-view';

export default Ember.Component.extend({
  layout,
  classNames: ['modal', 'fade'],

  didInsertElement() {
    $(this.element).modal({keyboard: false, backdrop: 'static'});
  },
  willDestroyElement() {
    $(this.element).modal('hide');
  }
});
