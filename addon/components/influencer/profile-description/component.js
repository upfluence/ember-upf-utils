import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['media', 'profile-description'],
  isSelectable: true
});
