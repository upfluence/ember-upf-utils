import Component from '@ember/component';
import EmberObject from '@ember/object';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

import layout from './template';

export default Component.extend({
  layout,

  exports: service(),
  toast: service(),

  multiple: true,
  items: null,
  placeholder: 'Import influencers from...',
  current: null,

  _performSearch(resolve) {
    return this.get('exports').searchEntities(this.keyword).then((response) => {
      let allItems = [];
      Object.keys(response).forEach(key => {
        response[key].forEach((item) => {
          allItems.push(
            EmberObject.create({entityType: key, item})
          );
        });
      });
      resolve(allItems);
    });
  },

  search() {
    return new RSVP.Promise((resolve) => {
      debounce(this, this._performSearch, resolve, 1000);
    }).catch(() => {
      this.get('toast').error('An error occurred, please try again');
    });
  },

  actions: {
    searchEntities(keyword) {
      this.set('keyword', keyword);
      this.set('items', this.search());
    }
  }
});
