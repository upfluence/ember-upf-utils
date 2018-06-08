import Ember from 'ember';
import layout from './template';
import TooltipActivationMixin from 'ember-upf-utils/mixins/tooltip-activation';

const {
  Component,
  computed,
  inject
} = Ember;

export default Component.extend(TooltipActivationMixin, {
  currentUser: inject.service(),

  layout,
  classNames: ['profile-description'],

  isSelectable: true,
  toggleAction: null,
  selected: null,
  selectedIcon: 'check',
  overlayType: 'selection',

  presentInLists: computed.gt('profile.lists.length', 0),

  // Avoid BC break with profile.selected
  _selected: computed('selected', 'profile.selected', {
    get() {
      return this.get('selected') || this.get('profile.selected');
    },
    set(_, value) {
      // selected not set
      if (this.get('selected') === null) {
        this.set('profile.selected', value);
      } else {
        this.set('selected', value);
      }

      return value;
    }
  }),

  listNames: computed('profile.lists', function() {
    return '<div style="text-align: left;">Present in<br />' + this.get('profile.lists').map((list) => {
      return '<i class="upf-icon upf-icon--influencers"></i> ' + list.get('name') + '<br />';
    }).join('') + '</div>';
  }),

  displayContact: computed.and('profile.email', 'hasInbox'),

  didInsertElement() {
    this.get('currentUser').fetch().then((payload) => {
      this.set('hasInbox', payload.user.granted_scopes.includes('inbox_client'));
    });
  }
});
