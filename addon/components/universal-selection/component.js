import Component from '@ember/component';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

import layout from './template';

export default Component.extend({
  layout,

  exports: service(),

  _model: '',
  items: null,
  placeholder: 'Select a list to import influencers',
  current: null,

  search(keyword) {
    return new RSVP.Promise((resolve) => {
      return this.get('exports').searchEntities(keyword).then((response) => {
        let allItems = [];
        Object.keys(response).forEach(key => {
          response[key].map((item) => {
            allItems.push(
              EmberObject.create({icon: key, item})
            );
          });
        });
        resolve(allItems);
      });
    }).then((res) => {
      return res;
    });
  },

  actions: {
    searchEntities(keyword) {
      this.set('items', this.search(keyword));
    }
  }
});
