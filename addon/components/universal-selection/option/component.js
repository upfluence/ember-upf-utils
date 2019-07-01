import Component from '@ember/component';
import { computed } from '@ember/object';

import layout from './template';

const ENTITIES_ICONS = {
  stream: 'upf-icon--monitor',
  list: 'upf-icon--search',
  mailing: 'upf-icon--inbox',
  campaign: 'upf-icon--workflow'
};

export default Component.extend({
  layout,

  tagName: 'li',
  classNames: ['universal-selection-option'],

  iconName: computed('item', function() {
    return ENTITIES_ICONS[this.item.type];
  })
});
