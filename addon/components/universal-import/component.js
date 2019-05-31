import Component from '@ember/component';
import layout from './template';
import { inject as service } from '@ember/service';
import ExportEntity from '@upfluence/ember-upf-utils/export-entity/model';

export default Component.extend({
  layout,

  imports: service(),
  exports: service(),
  toast: service(),

  _model: '',
  _canCreate: true,
  items: null,
  createOptionPlaceholder: 'Create list',
  placeholder: 'Pick or create a list',

  didInsertElement() {
  // need to fetch from all, not just list.
    // this.get('exports').fetchEntities('list', (response) => {
    //   this.set('items', response.entities.map((item) => {
    //     return ExportEntity.create(item);
    //   }));
    // });

    this.get('imports').fetchKeywordResults('mailing', (response) => {
      console.log(response);
    });
  },

  actions: {
    didCreateItem(item) {
      let _i = this.get('items');
      _i.pushObject(item);
      this.set('items', _i);
    },

    searchEntities(keyword) {
    // call import service here
      this.get('imports').fetchKeywordResults(keyword, (response) => {
        console.log(response);
      });  
    },
  }
});
