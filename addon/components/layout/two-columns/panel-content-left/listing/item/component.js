import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['__listing_item'],

  item: null,
  itemRoutePath: null,

  deleteAction: null,
  deleteIcon: 'minus-circle',

  countTitle: '{{count}}',

  hasCount: Ember.computed.gte('item.count', 0),

  countTitleComputed: Ember.computed('countTitle', 'item.count', function () {
    return this.get('countTitle').replace('{{count}}', this.get('item.count'));
  }),

  actions: {
    onDelete() {
      this.sendAction('deleteAction', this.get('item'));
    }
  }
});
