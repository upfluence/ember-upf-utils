import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['details-description'],
  displayLink: false,

  facadeURL: Ember.computed(function() {
    return Ember.getOwner(this).resolveRegistration(
      'config:environment'
    ).facadeURL;
  }),

  link: Ember.computed('facadeURL', 'profile.id', function() {
    return `${this.get('facadeURL')}influencers/${this.get('profile.id')}`;
  }),

  actions: {
    close() {
      this.sendAction('escAction');
    }
  }
});
