import Ember from 'ember';
import layout from './template';

const {
  Component,
  observer,
  inject
} = Ember;

export default Component.extend({
  layout,
  light: false,
  currentUser: inject.service(),
  classNameBindings: ['light:light-background:dark-background'],

  display: false,
  ownerships: [],
  _toggled: false,

  didInsertElement() {
    this.get('currentUser').fetchOwnerships().then((ownerships) => {
      if (ownerships.length > 1) {
        this.set('display', true);
      }

      this.set('ownerships', ownerships);
      this.set(
        'ownership',
        ownerships.find((item) => {
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
