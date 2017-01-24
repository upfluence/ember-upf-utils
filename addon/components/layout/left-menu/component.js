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
    return `${this.get('facadeURL')}/influencers`;
  }),

  listURL: Ember.computed('facadeURL', function() {
    return `${this.get('facadeURL')}/lists`;
  }),

  inboxURL: Ember.computed(function() {
    return Ember.getOwner(this).resolveRegistration(
      'config:environment'
    ).inboxURL;
  }),

  listURL: Ember.computed('inboxURL', function() {
    return `${this.get('inboxURL')}/mailings`;
  }),

  actions: {
    logout() {
      this.get('session').invalidate();
    }
  }
});
