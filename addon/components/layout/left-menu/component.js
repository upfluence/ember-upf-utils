import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['__left-menu'],

  session: Ember.inject.service(),

  facadeURL: Ember.computed(function() {
    return Ember.getOwner(this).resolveRegistration(
      'config:environment'
    ).facadeURL;
  }),

  searchURL: Ember.computed('facadeURL', function() {
    if (this.get('facadeURL')) {
      return `${this.get('facadeURL')}/influencers`;
    }

    return 'influencers';
  }),

  listURL: Ember.computed('facadeURL', function() {
    if (this.get('facadeURL')) {
      return `${this.get('facadeURL')}/lists`;
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
      return `${this.get('inboxURL')}/mailings`;
    }

    return 'mailings';
  }),

  actions: {
    logout() {
      this.get('session').invalidate();
    }
  }
});
