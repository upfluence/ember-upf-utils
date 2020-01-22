import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import layout from './template';

const INCLUDES_ILLUSTRATION = ['crm', 'bulk_emailing', 'monitor'];

export default Component.extend({
  layout,

  assetMap: service(),
  intl: service(),
  currentUser: service(),

  hidden: true,
  to: null,
  hasSubscription: false,

  identityURL: computed(function() {
    return getOwner(this).resolveRegistration(
      'config:environment'
    ).identityURL;
  }),

  description: computed('to', function() {
    let intlKey = 'default';

    if (['monitor', 'bulk_emailing'].includes(this.to)) {
      intlKey = this.to;
    }

    return this.intl.t(`upgrade_modal.details.${intlKey}`, { htmlSafe: true });
  }),

  upgradeFeatureImagePath: computed('to', function() {
    if (!INCLUDES_ILLUSTRATION.includes(this.to)) return;

    return this.assetMap.resolve(
      `assets/@upfluence/ember-upf-utils/images/${this.to}.png`
    );
  }),

  canSelfUpgrade: computed('hasSubscription', 'to', function() {
    return this.hasSubscription && this.to !== 'crm';
  }),

  cta: computed('canSelfUpgrade', function() {
    let intlKey = (this.canSelfUpgrade) ? 'upgrade' : 'contact';

    return this.intl.t(`upgrade_modal.cta.${intlKey}`);
  }),

  init() {
    this._super();

    this.currentUser.fetch().then(({ user, account_subscriptions }) => {
      this.set('hasSubscription', (account_subscriptions || []).length > 0);
    });
  },

  actions: {
    clickedCTA() {
      if (this.canSelfUpgrade) {
        window.location = `${this.identityURL}accounts/billing`;
      } else if (window.Intercom) {
        window.Intercom('show');
      }
    }
  }
});
