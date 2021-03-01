import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { observer, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';

import layout from './template';

const CANNY_URL = 'https://upfluence.canny.io/feature-requests';

export default Component.extend({
  layout,
  classNames: ['__left-menu'],

  session: service(),

  hideUpgradeModal: true,
  upgradeTo: null,

  userInfos: {
    property: 'avatar_url',
    textProperty: 'fullName',
    imageSize: '36'
  },

  _1: observer('user', function() {
    [
      'has_facade_notifications', 'has_inbox_notifications',
      'has_publishr_notifications', 'has_analytics_notifications',
      'has_payments_notifications'
    ].forEach((notifPresence) => {
      this.set(camelize(notifPresence), this.user[notifPresence]);
    });
  }),

  _2: observer('user', function() {
    let { first_name, last_name } = this.user;
    if (first_name || last_name) {
      this.set('user.fullName', `${first_name} ${last_name}`);
    } else {
      this.set('user.fullName', 'Anonymous User');
    }
  }),

  facadeURL: computed(function() {
    return getOwner(this).resolveRegistration(
      'config:environment'
    ).facadeURL;
  }),

  analyticsURL: computed(function() {
    return getOwner(this).resolveRegistration(
      'config:environment'
    ).analyticsURL;
  }),

  identityURL: computed(function() {
    return getOwner(this).resolveRegistration(
      'config:environment'
    ).identityURL;
  }),

  searchURL: computed('facadeURL', function() {
    if (this.facadeURL) {
      return `${this.facadeURL}influencers`;
    }

    return 'influencers';
  }),

  acquisitionURL: computed(function() {
    return getOwner(this).resolveRegistration(
      'config:environment'
    ).acquisitionURL;
  }),

  streamsURL: computed('analyticsURL', function() {
    let module = getOwner(this).resolveRegistration(
      'config:environment'
    ).modulePrefix;

    return module === 'analytics-web' ? 'application' : this.analyticsURL;
  }),

  acquisitionCampaignsURL: computed('acquisitionURL', function() {
    let module = getOwner(this).resolveRegistration(
      'config:environment'
    ).modulePrefix;

    return module === 'acquisition-web' ? 'application' : this.acquisitionURL;
  }),

  crmURL: computed(function() {
    let { crmUrl, modulePrefix } = getOwner(this).resolveRegistration('config:environment');

    return modulePrefix === 'crm-web' ? 'application' : crmUrl;
  }),

  listURL: computed('facadeURL', function() {
    let module = getOwner(this).resolveRegistration(
      'config:environment'
    ).modulePrefix;

    return module === 'facade-web' ? 'application' : this.facadeURL;
  }),

  inboxURL: computed(function() {
    let url = getOwner(this).resolveRegistration(
      'config:environment'
    ).inboxURL;

    let module = getOwner(this).resolveRegistration(
      'config:environment'
    ).modulePrefix;

    // Since application is a valid route this will active the icon
    return module === 'inbox-client' ? 'application' : url;
  }),

  accountUrl: computed('identityURL', function() {
    if (this.identityURL) {
      return `${this.identityURL}accounts/me`;
    }

    return `accounts/me`;
  }),

  publishrURL: computed(function() {
    return getOwner(this).resolveRegistration(
      'config:environment'
    ).publishrURL;
  }),

  publishrCampaignsURL: computed('publishrURL', function() {
    return `${this.publishrURL}campaigns`;
  }),

  publishrPaymentsURL: computed('publishrURL', function() {
    return `${this.publishrURL}payments`;
  }),

  publishrClientURL: computed('_publishrClientURL', function() {
    let baseURL = getOwner(this).resolveRegistration(
      'config:environment'
    ).publishrClientURL || '';

    let module = getOwner(this).resolveRegistration(
      'config:environment'
    ).modulePrefix;

    let suffix = baseURL.endsWith('/') ? 'campaigns' : '/campaigns';
    let fullURL = baseURL + suffix;

    return module === 'publishr-client-web' ? 'application' : fullURL;
  }),

  actions: {
    goToSettings() {
      window.location = this.accountUrl;
    },

    openCanny() {
      window.open(CANNY_URL, '_blank');
    },

    openUserlane() {
      this.send('toggleUserMenu');
      window.Userlane('openAssistant');
    },

    logout() {
      this.session.invalidate();
    },

    toggleUserMenu() {
      this.$('.__left-menu__user-menu').toggleClass(
        '__left-menu__user-menu--opened'
      );
    },

    toggleUpgradeModal(upgradeTo) {
      this.set('upgradeTo', upgradeTo);
      this.toggleProperty('hideUpgradeModal');
    }
  }
});
