import Component from '@ember/component';
import layout from './template';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,

  imports: service(),

  _model: '',
  _canCreate: false,
  items: null,
  placeholder: 'Pick a list',

  actions: {
    searchEntities(keyword) {
      this.get('imports').fetchKeywordResults(keyword, (response) => {
        let allItems = [];

        Object.keys(response).forEach(key => {
          response[key].map((item) => allItems.push({icon: key, item}));
        });

        this.set('items', allItems);
      });  
    },
  }
});
