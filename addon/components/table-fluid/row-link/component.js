import Ember from 'ember';
import layout from './template';

export default Ember.LinkComponent.extend({
  layout,
  tagName: 'div',
  classNames: ['__table-fluid-row', 'row-link', 'row'],
  activeClass: 'active'
});
