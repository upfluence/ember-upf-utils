import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';

const ENTITIES_ICONS = {
  stream: 'upf-icon--monitor',
  list: 'upf-icon--search',
  mailing: 'upf-icon--inbox',
  campaign: 'upf-icon--workflow',
  discount_plan: {
    type: 'font-awesome',
    name: 'fa-tags'
  }
};

export default Component.extend({
  layout,

  classNames: ['universal-selection-group'],

  icon: computed('group.groupName', 'item', function() {
    return ENTITIES_ICONS[(this.group.groupName.toLowerCase())];
  })
});
