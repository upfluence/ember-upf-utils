import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['__listing'],

  items: null,
  itemRoutePath: null,

  deleteAction: null,
  deleteIcon: 'minus-circle',

  countTitle: '{{count}}'
});
