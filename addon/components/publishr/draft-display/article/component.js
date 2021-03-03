import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  uploaderHeaders: {
    Scope: 'publishr_admin'
  },

  uploaderExtra: {
    privacy: 'public'
  },

  actions: {
    onContentChange(text) {
      this.set('item.body', text);
    }
  }
});
