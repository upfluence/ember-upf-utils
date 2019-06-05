import Component from '@ember/component';
import layout from './template';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,

  exports: service(),

  _model: '',
  _canCreate: false,
  items: null,
  placeholder: 'Select a list to import influencers',

  actions: {
    searchEntities(keyword) {
      this.get('exports').searchEntities(keyword).then((res) => {
        let allItems = [];

        Object.keys(response).forEach(key => {
          response[key].map((item) => allItems.push({icon: key, item}));
        });

        this.set('items', allItems);
      });
    }
  }
});
