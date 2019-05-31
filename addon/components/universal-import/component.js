import Component from '@ember/component';
import layout from './template';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,

  exports: service(),
  toast: service(),

  _canCreate: true,
  items: null,
  createOptionPlaceholder: 'Create list',
  placeholder: 'Pick or create a list',

  actions: {
    didCreateItem(item) {
      let _i = this.get('items');
      _i.pushObject(item);
      this.set('items', _i);
    }    
  }
});
