import Ember from 'ember';
import layout from './template';

const {
  Component,
  String,
  computed,
  observer,
  getOwner,
  inject
} = Ember;

export default Component.extend({
  layout,
  classNames: ['__left-menu'],

  session: inject.service(),
  userScopes: [],

  hasFacade: true,
  hasInbox: true,
  hasAnalytics: false,
  hasPublishr: false,
  hasPublishrClient: false,

  userInfos: {
    property: 'avatar_url',
    textProperty: 'fullName',
    imageSize: '36'
  },

  _: observer('userScopes', function() {
    if (!this.get('userScopes.length')) {
      return;
    }

    if (!this.get('userScopes').includes('inbox_client')) {
      this.set('hasInbox', false);
    }

    if (!this.get('userScopes').includes('facade_web')) {
      this.set('hasFacade', false);
    }

    if (this.get('userScopes').includes('analytics_web')) {
      this.set('hasAnalytics', true);
    }

    if (this.get('userScopes').includes('publishr_admin')) {
      this.set('hasPublishr', true);
    }

    if (this.get('userScopes').includes('publishr_client')) {
      this.set('hasPublishrClient', true);
    }
  }),

  _1: observer('user', function() {
    [
      'has_facade_notifications', 'has_inbox_notifications',
      'has_publishr_notifications', 'has_analytics_notifications',
      'has_payments_notifications'
    ].forEach((notifPresence) => {
      this.set(
        String.camelize(notifPresence),
        this.get('user')[notifPresence]
      );
    });
  }),

  _2: observer('user', function() {
    let { first_name, last_name } = this.get('user');
    if (first_name || last_name) {
      this.set('user.fullName', `${first_name} ${last_name}`);
    } else {
      this.set('user.fullName', 'Anonymous User');
    }
  }),

  facadeURL: computed(function() {
    return Ember.getOwner(this).resolveRegistration(
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
    if (this.get('facadeURL')) {
      return `${this.get('facadeURL')}influencers`;
    }

    return 'influencers';
  }),

  streamsURL: computed('analyticsURL', function() {
    if (this.get('analyticsURL')) {
      return `${this.get('analyticsURL')}streams`;
    }

    return 'streams';
  }),

  listURL: computed('facadeURL', function() {
    if (this.get('facadeURL')) {
      return `${this.get('facadeURL')}lists`;
    }

    return 'lists';
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

  accountUrl: computed(function() {
    if (this.get('identityURL')) {
      return `${this.get('identityURL')}accounts/me`;
    }

    return `accounts/me`;
  }),

  publishrURL: computed(function() {
    return getOwner(this).resolveRegistration(
      'config:environment'
    ).publishrURL;
  }),

  _publishrClientURL: computed(function() {
    return getOwner(this).resolveRegistration(
      'config:environment'
    ).publishrClientURL;
  }),

  publishrCampaignsURL: computed('publishrURL', function() {
    return `${this.get('publishrURL')}campaigns`;
  }),

  publishrPaymentsURL: computed('publishrURL', function() {
    return `${this.get('publishrURL')}payments`;
  }),

  publishrClientURL: computed('_publishrClientURL', function() {
    if (this.get('_publishrClientURL')) {
      return `${this.get('_publishrClientURL')}/campaigns`;
    }

    return 'campaigns';
  }),

  actions: {
    goToSettings() {
      window.location = this.get('accountUrl');
    },

    logout() {
      this.get('session').invalidate();
    },

    openUserMenu() {
      this.$('.__left-menu__user-menu').toggleClass(
        '__left-menu__user-menu--opened'
      );
    }
  }
});
