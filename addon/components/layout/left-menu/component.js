import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['__left-menu'],

  session: Ember.inject.service(),
  currentUser: Ember.inject.service(),

  hasFacade: false,
  hasInbox: false,

  init() {
    this._super();
    this.get('currentUser').fetch().then((payload) => {
      if (payload.user.granted_scopes.includes('inbox_client')) {
        this.set('hasInbox', true);
      }

      if (payload.user.granted_scopes.includes('facade_web')) {
        this.set('hasFacade', true);
      }
    }).catch(() => {
      this.set('hasFacade', true);
      this.set('hasInbox', true);
    });
  },

  facadeURL: Ember.computed(function() {
    return Ember.getOwner(this).resolveRegistration(
      'config:environment'
    ).facadeURL;
  }),

  searchURL: Ember.computed('facadeURL', function() {
    if (this.get('facadeURL')) {
      return `${this.get('facadeURL')}influencers`;
    }

    return 'influencers';
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
