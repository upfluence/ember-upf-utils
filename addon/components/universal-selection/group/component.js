import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';

const ENTITIES_ICONS = {
  stream: 'upf-icon--monitor',
  list: 'upf-icon--search',
  mailing: 'upf-icon--inbox',
  campaign: 'upf-icon--workflow'
};

export default Component.extend({
  layout,

  classNames: ['universal-selection-group'],

  iconName: computed('item', function() {
    return ENTITIES_ICONS[(this.group.groupName.toLowerCase())];
  })
});
