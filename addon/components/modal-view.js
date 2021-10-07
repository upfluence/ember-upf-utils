import Component from '@ember/component';
import { deprecate } from '@ember/debug';
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

  _: observer('hidden', function () {
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

    deprecate('modal-view component is deprecated. Please use OSS::Modal from @upfluence/oss-components.', false, {
      id: 'no-modal-view-component',
      for: '@upfluence/ember-upf-utils',
      until: '7.0.0',
      since: { enabled: '5.0.7' }
    });

    if (!this.hidden) {
      this._setupModal();
    }

    this.element.addEventListener('keydown', this._handleEscapeKey.bind(this));

    this.$('button#close-x').click((e) => this.closeModal(e));
  },

  _setupModal() {
    let modal = this.$().modal({
      backdrop: 'static'
    });

    if (this.container) {
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
