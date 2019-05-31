import Component from '@ember/component';
import layout from './template';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,

  imports: service(),
  toast: service(),

  _model: '',
  _canCreate: true,
  items: null,
  createOptionPlaceholder: 'Create list',
  placeholder: 'Pick or create a list',

  actions: {
    didCreateItem(item) {
      let _i = this.get('items');
      _i.pushObject(item);
      this.set('items', _i);
    },

    searchEntities(keyword) {
    // call import service here
      this.get('imports').fetchKeywordResults(keyword, (response) => {
        let allItems = [];

        Object.keys(response).forEach(key => {
          response[key].map((item) => allItems.push(item));
        });

        this.set('items', allItems);     
      });  
    },
  }
});
