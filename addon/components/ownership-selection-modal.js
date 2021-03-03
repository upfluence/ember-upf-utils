import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed, defineProperty, observer } from '@ember/object';
import { underscore } from '@ember/string';

export default Component.extend({
  classNames: ['ownership-selection'],

  ownershipUpdater: service(),
  toast: service(),
  currentUser: service(),

  _toastConfig: {
    timeOut: 0,
    extendedTimeOut: 0,
    closeButton: true,
    tapToDismiss: true
  },

  header: 'Share with',
  cta: 'Share',
  currentWindow: 'groups',

  tabs: {
    people: true,
    groups: true
  },

  _resetWindow: observer('model.id', function () {
    if (this.model) {
      const isComposite = this.get('model.ownedBy').startsWith('composite:');
      this.set('currentWindow', isComposite ? 'people' : 'groups');
    }
  }),

  init() {
    this._super();

    ['people', 'groups'].forEach((e) => {
      defineProperty(
        this,
        `${e}Selected`,
        computed('currentWindow', function () {
          return this.currentWindow === e;
        })
      );
    });
  },

  didReceiveAttrs() {
    this._super();

    if (this.model && this.model.ownedBy.startsWith('composite:')) {
      this.set('currentWindow', 'people');
    }
  },

  actions: {
    setCurrent(tab) {
      this.set('currentWindow', tab);
    },

    performCloseModal() {
      this.sendAction('closeModal');
      this.toast.success(this.successfulSharing, 'Sharing Success', this._toastConfig);
    },

    saveOwnership(newOwnership) {
      return this.ownershipUpdater.update(this.modelType, this.get('model.id'), newOwnership).then((entity) => {
        this.model.set('ownedBy', entity[underscore(this.modelType)].owned_by);
        this.send('performCloseModal');
      });
    }
  }
});
