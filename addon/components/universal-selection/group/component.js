import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';

const ENTITIES_ICONS = {
  stream: {
    type: 'upf-icon',
    name: 'upf-icon--monitor'
  },
  list: {
    type: 'upf-icon',
    name: 'upf-icon--search'
  },
  mailing: {
    type: 'upf-icon',
    name: 'upf-icon--inbox'
  },
  campaign: {
    type: 'upf-icon',
    name: 'upf-icon--workflow'
  },
  discount_plan: {
    type: 'font-awesome',
    name: 'fa-tags'
  },
  acquisition_campaign: {
    type: 'upf-icon',
    name: 'upf-icon--acquisition'
  }
};

export default Component.extend({
  layout,

  classNames: ['universal-selection-group'],

  icon: computed('group.groupName', 'item', function () {
    return (
      ENTITIES_ICONS[this.group.groupName.toLowerCase()].icon || ENTITIES_ICONS[this.group.groupName.toLowerCase()]
    );
  })
});
