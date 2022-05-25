import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  assetMap: service(),
  intl: service(),
  currentUser: service(),

  hidden: true,
  to: null,
  hasSubscription: false,

  identityURL: computed(function () {
    return getOwner(this).resolveRegistration('config:environment').identityURL;
  }),

  description: computed('to', function () {
    let intlKey = 'default';

    if (['monitor', 'bulk_emailing'].includes(this.to)) {
      intlKey = this.to;
    }

    return this.intl.t(`upgrade_modal.details.${intlKey}`, { htmlSafe: true });
  }),

  canSelfUpgrade: computed('hasSubscription', 'to', function () {
    return this.hasSubscription && this.to !== 'crm';
  }),

  cta: computed('canSelfUpgrade', function () {
    let intlKey = this.canSelfUpgrade ? 'upgrade' : 'contact';

    return this.intl.t(`upgrade_modal.cta.${intlKey}`);
  }),

  init() {
    this._super();

    this.currentUser.fetch().then(({ account_subscriptions }) => {
      this.set('hasSubscription', (account_subscriptions || []).length > 0);
    });
  },

  actions: {
    clickedCTA() {
      const csChat = getOwner(this).lookup('service:cs-chat');

      if (this.canSelfUpgrade) {
        window.location = `${this.identityURL}accounts/billing`;
      } else if (csChat) {
        csChat.openTicket();
      }
    }
  }
});
