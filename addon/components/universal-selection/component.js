import Component from '@ember/component';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';

import layout from './template';

export default Component.extend({
  layout,

  exports: service(),

  _model: '',
  items: null,
  placeholder: 'Select a list to import influencers',
  current: null,

  actions: {
    searchEntities(keyword) {
      this.get('exports').searchEntities(keyword).then((response) => {
        let allItems = [];

        Object.keys(response).forEach(key => {
          response[key].map((item) => {
            allItems.push(
              EmberObject.create({icon: key, item})
            );
          });
        });

        this.set('items', allItems);
      });
    }
  }
});
