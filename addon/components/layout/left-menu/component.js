import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['__left-menu'],

  session: Ember.inject.service(),
  userScopes: [],

  hasFacade: true,
  hasInbox: true,
  hasAnalytics: false,

  _: Ember.observer('userScopes', function() {
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
  }),

  facadeURL: Ember.computed(function() {
    return Ember.getOwner(this).resolveRegistration(
      'config:environment'
    ).facadeURL;
  }),

  analyticsURL: Ember.computed(function() {
    return Ember.getOwner(this).resolveRegistration(
      'config:environment'
    ).analyticsURL;
  }),

  searchURL: Ember.computed('facadeURL', function() {
    if (this.get('facadeURL')) {
      return `${this.get('facadeURL')}influencers`;
    }

    return 'influencers';
  }),

  streamsURL: Ember.computed('analyticsURL', function() {
    if (this.get('analyticsURL')) {
      return `${this.get('analyticsURL')}streams`;
    }

    return 'streams';
  }),

  listURL: Ember.computed('facadeURL', function() {
    if (this.get('facadeURL')) {
      return `${this.get('facadeURL')}lists`;
    }

    return 'lists';
  }),

  inboxURL: Ember.computed(function() {
    return Ember.getOwner(this).resolveRegistration(
      'config:environment'
    ).inboxURL;
  }),

  mailingURL: Ember.computed('inboxURL', function() {
    if (this.get('inboxURL')) {
      return `${this.get('inboxURL')}mailings`;
    }

    return 'mailings';
  }),

  actions: {
    logout() {
      this.get('session').invalidate();
    }
  }
});
