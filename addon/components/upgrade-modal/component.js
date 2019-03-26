import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import layout from './template';


export default Component.extend({
  layout,

  assetMap: service(),

  hidden: true,
  to: null,

  identityURL: computed(function() {
    return getOwner(this).resolveRegistration(
      'config:environment'
    ).identityURL;
  }),

  upgradeFeatureImagePath: computed('to', function() {
    return this.assetMap.resolve(
      `assets/@upfluence/ember-upf-utils/images/${this.to}.png`
    );
  }),

  actions: {
    goToBilling() {
      window.location = `${this.identityURL}accounts/billing`;
    },

    openIntercom() {
      if (window.Intercom) {
        window.Intercom('show');
      }
    }
  }
});
