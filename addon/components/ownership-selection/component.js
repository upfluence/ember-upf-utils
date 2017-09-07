import Ember from 'ember';
import layout from './template';

const { observer, inject } = Ember;

export default Ember.Component.extend({
  layout,
  light: false,
  currentUser: inject.service(),
  classNames: ['margin-right-xx-sm'],
  classNameBindings: ['light:light-background:dark-background'],

  display: false,
  ownerships: [],
  _toggled: false,

  didInsertElement() {
    this.get('currentUser').fetch().then((payload) => {
      this.get('ownerships').pushObject(
        { id: `user:${payload.user.id}`, name: payload.user.first_name }
      );

      payload.teams.forEach((team) => {
        this.set('display', true);
        this.get('ownerships').pushObject(
          { id: `team:${team.id}`, name: team.name }
        );
      });

      payload.companies.forEach((company) => {
        this.set('display', true);
        this.get('ownerships').pushObject(
          { id: `company:${company.id}`, name: company.name }
        );
      });

      this.set(
        'ownership',
        this.get('ownerships').find((item) => {
          return item.id === this.get('entity.ownedBy');
        })
      );
    });
  },

  _1: observer('entity.name', function() {
    this.set('_toggled', false);
    this.set(
      'ownership',
      this.get('ownerships').find((item) => {
        return item.id === this.get('entity.ownedBy');
      })
    );
  }),

  _2: observer('ownership', function() {
    if (this.get('entity.ownedBy') !== this.get('ownership.id')) {
      this.set('entity.ownedBy', this.get('ownership.id'));
      this.get('entity').save().then( () => this.toggleProperty('_toggled'));
    }
  }),

  actions: {
    toggle() {
      this.toggleProperty('_toggled');
    }
  }
});
