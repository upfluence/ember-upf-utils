import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'li',
  classNames: ['ember-power-select-option', 'power-select-option'],
  layout,

  iconName: computed('item.option.entityType', function() {
    switch(this.item.option.entityType) {
      case 'stream':
        return 'monitor';
      case 'list':
        return 'search';
      case 'mailing':
        return 'inbox';
      case 'campaign':
        return 'workflow';
    }
  })
});
