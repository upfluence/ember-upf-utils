import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { observer } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,

  currentUser: service(),

  display: false,

  didInsertElement() {
    this.get('currentUser').fetchOwnerships().then((ownerships) => {
      if (ownerships.length > 1) {
        this.set('display', true);
      }

      this.set(
        'ownerships',
        ownerships.filter((x) => !x.id.startsWith('composite:'))
      );

      this.set(
        'ownership',
        ownerships.find((item) => {
          return item.id === this.get('entity.ownedBy');
        })
      );
    });
  },

  _1: observer('entity.name', function() {
    this.set('_toggled', false);
    this.set(
      'ownership',
      this.get('ownerships').find((item) => {
        return item.id === this.get('entity.ownedBy');
      })
    );
  }),

  _2: observer('ownership', function() {
    if (this.get('entity.ownedBy') !== this.get('ownership.id')) {
      this.set('entity.ownedBy', this.get('ownership.id'));
    }
  }),

  actions: {
    toggle() {
      this.toggleProperty('_toggled');
    }
  }
});
