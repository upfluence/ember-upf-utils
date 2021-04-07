import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import layout from './template';

export default Component.extend({
  layout,

  assetMap: service(),

  imagePath: computed('imgName', function () {
    return this.assetMap.resolve(`assets/@upfluence/ember-upf-utils/images/${this.imgName}.svg`);
  }),

  actions: {
    openIntercom() {
      if (window.Intercom) {
        window.Intercom('showNewMessage');
      }
    }
  }
});
