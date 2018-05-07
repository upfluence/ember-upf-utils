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
    return getOwner(this).resolveRegistration(
      'config:environment'
    ).inboxURL;
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

  publishrClientURL: computed(function() {
    return getOwner(this).resolveRegistration(
      'config:environment'
    ).publishrClientURL;
  }),

  mailingURL: computed('inboxURL', function() {
    if (this.get('inboxURL')) {
      return `${this.get('inboxURL')}mailings`;
    }

    return 'mailings';
  }),

  publishrCampaignsURL: computed('publishrURL', function() {
    return `${this.get('publishrURL')}campaigns`;
  }),

  publishrPaymentsURL: computed('publishrURL', function() {
    return `${this.get('publishrURL')}payments`;
  }),

  _publishrClientURL: computed('publishrClientURL', function() {
    if (this.get('publishrClientURL')) {
      return `${this.get('publishrClientURL')}campaigns`;
    }

    return 'campaigns';
  }),

  actions: {
    logout() {
      this.get('session').invalidate();
    }
  }
});
