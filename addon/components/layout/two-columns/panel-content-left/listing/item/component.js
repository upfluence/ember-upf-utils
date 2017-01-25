import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['__listing_item'],

  item: null,
  itemRoutePath: null,

  deleteAction: null,

  hasCount: Ember.computed.gte('item.count', 0),

  actions: {
    onDelete() {
      this.sendAction('deleteAction', this.get('item'));
    }
  }
});
