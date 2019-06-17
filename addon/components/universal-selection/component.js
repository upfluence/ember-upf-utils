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

  _model: '',
  items: null,
  placeholder: 'Select a list to import influencers',
  current: null,

  search() {
    return new RSVP.Promise((resolve) => {
      return this.get('exports').searchEntities(this.keyword).then((response) => {
        let allItems = [];
        Object.keys(response).forEach(key => {
          response[key].forEach((item) => {
            allItems.push(
              EmberObject.create({entityType: key, item})
            );
          });
        });
        this.set('items', allItems);
      });
    }).catch(() => {
      this.get('toast').error('An error occurred, please try again');
    });
  },

  actions: {
    searchEntities(keyword) {
      this.set('keyword', keyword);
      debounce(this, this.search, 1000);
    }
  }
});
