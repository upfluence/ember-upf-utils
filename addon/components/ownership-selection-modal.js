import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed, defineProperty, observer } from '@ember/object';
import { isEmpty } from '@ember/utils';

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

  _resetWindow: observer('model.id', function() {
    this.set('currentWindow', this.model.ownedBy.startsWith('composite:') ? 'people' : 'groups');
  }),

  init() {
    this._super();

    ['people', 'groups'].forEach((e) => {
      defineProperty(
        this,
        `${e}Selected`,
        computed('currentWindow', function() {
          return this.get('currentWindow') === e;
        })
      );
    });
  },

  didReceiveAttrs() {
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
      this.get('toast').success(
        this.get('successfulSharing'),
        'Sharing Success',
        this._toastConfig
      );
    },

    saveOwnership(newOwnership) {
      return this.get('ownershipUpdater').update(
        this.get('modelType'),
        this.get('model.id'),
        newOwnership
      ).then(() => {
        this.send('performCloseModal');
      });
    }
  }
});
