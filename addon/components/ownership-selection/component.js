import Component from '@ember/component';
import { observer } from '@ember/object';
import { inject as service } from '@ember/service';

import layout from './template';

export default Component.extend({
  layout,

  currentUser: service(),

  display: false,

  didInsertElement() {
    this._super(...arguments);

    this.currentUser.fetchOwnerships().then((ownerships) => {
      this.set('display', ownerships.length > 1);

      this.set(
        'ownerships',
        ownerships.filter((x) => !x.id.startsWith('composite:'))
      );

      this.set(
        'ownership',
        ownerships.find((item) => item.id === this.get('entity.ownedBy'))
      );
    });
  },

  _1: observer('entity.id', function() {
    this.set(
      'ownership',
      this.ownerships.find((item) => item.id === this.get('entity.ownedBy'))
    );
  }),

  _2: observer('ownership', function() {
    if (this.get('entity.ownedBy') !== this.get('ownership.id')) {
      this.set('entity.ownedBy', this.get('ownership.id'));
    }
  })
});
