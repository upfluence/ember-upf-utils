import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  showImportButton: false,

  iconName: computed('icon', function() {
    switch(this.icon) {
      case 'stream':
        return 'monitor';
      case 'list':
        return 'search';
      case 'mailing':
        return 'inbox';
      case 'campaign':
        return 'workflow';
    }
  }),

  mouseEnter() {
    this.toggleProperty('showImportButton');
  }, 

  mouseLeave() {
    this.toggleProperty('showImportButton');
  },

  actions: {
    import() {
      console.log('import action here from ', this.item.id);
    }
  }
});
