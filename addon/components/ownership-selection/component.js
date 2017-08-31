import Ember from 'ember';
import Owners from 'ember-upf-utils/components/ownership-selection/owner';
import layout from './template';

export default Ember.Component.extend({
  layout,
  owners: Owners
});
