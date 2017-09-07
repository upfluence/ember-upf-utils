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

  didInsertElement() {
    this.get('currentUser').fetch().then((payload) => {
      this.get('ownerships').pushObject(
        { id: `user:${payload.user.id}`, name: payload.user.first_name }
      );

      payload.companies.forEach((company) => {
        this.set('display', true);
        this.get('ownerships').pushObject(
          { id: `company:${company.id}`, name: company.name }
        );
      });

      payload.teams.forEach((team) => {
        this.set('display', true);
        this.get('ownerships').pushObject(
          { id: `team:${team.id}`, name: team.name }
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

  _: observer('ownership', function() {
    if (this.get('entity.ownedBy') !== this.get('ownership.id')) {
      this.set('entity.ownedBy', this.get('ownership.id'));
      this.get('entity').save();
    }
  })
});
