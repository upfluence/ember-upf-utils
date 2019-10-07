import Component from '@ember/component';
import { observer } from '@ember/object';
import { isNone } from '@ember/utils';
import layout from '../templates/components/modal-view';

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
      this._setupModal();
    }
  }),

  didInsertElement() {
    if(!this.get('hidden')) {
      this._setupModal();
    }

    this.$().keyup((e) => {
      if (e.which === 27) {
        this.closeModal(e);
      }
    });

    this.$('button#close-x').click((e) => this.closeModal(e));
  },

  _setupModal() {
    //TODO IMPROVE THIS PART TO WORK WITHOUT 'CONTAINER'
    if(this.get('container')) {
      this.$().modal({
        backdrop: 'static'
      }).appendTo("body");
    } else {
      this.$().modal({
        backdrop: 'static'
      });
    }
  },

  closeModal(e) {
    e.preventDefault();
    this.sendAction('closeAction');
  },

  willDestroyElement() {
    this.$(this.element).modal('hide');
  }
});
