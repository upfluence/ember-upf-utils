import Component from '@ember/component';
import { observer } from '@ember/object';
import layout from '../templates/components/modal-view';

export default Component.extend({
  layout,
  classNames: ['modal', 'fade'],
  attributeBindings: ['tabindex'],

  tabindex: -1,
  toggleable: false,
  hidden: false,
  container: null,
  centered: true,
  customHeader: false,
  borderlessHeader: false,
  id: null,

  _: observer('hidden', function() {
    if (this.hidden) {
      this.$().modal('hide');
    } else {
      this._setupModal();
    }
  }),

  _handleEscapeKey(event) {
    if (event.keyCode === 27) {
      this.closeModal(event);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    if(!this.hidden) {
      this._setupModal();
    }

    this.element.addEventListener('keydown', this._handleEscapeKey.bind(this));

    this.$('button#close-x').click((e) => this.closeModal(e));
  },

  _setupModal() {
    let modal = this.$().modal({
      backdrop: 'static'
    });

    if(this.container) {
      modal.appendTo(this.container);
    }
  },

  closeModal(e) {
    e.preventDefault();
    this.sendAction('closeAction');
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$(this.element).modal('hide');
    this.element.removeEventListener('keydown', this._handleEscapeKey.bind(this));
  }
});
