import { inject as service } from '@ember/service';
import { gt, and, gte } from '@ember/object/computed';
import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';
import TooltipActivationMixin from '@upfluence/ember-upf-utils/mixins/tooltip-activation';

export default Component.extend(TooltipActivationMixin, {
  currentUser: service(),

  layout,
  classNames: ['profile-description'],

  isSelectable: true,
  toggleAction: null,
  selected: null,
  selectedIcon: 'check',
  overlayType: 'selection',

  presentInLists: gt('profile.lists.length', 0),

  // Avoid BC break with profile.selected
  _selected: computed('selected', 'profile.selected', {
    get() {
      return this.selected || this.get('profile.selected');
    },
    set(_, value) {
      // selected not set
      if (this.selected === null) {
        this.set('profile.selected', value);
      } else {
        this.set('selected', value);
      }

      return value;
    }
  }),

  listNames: computed('profile.lists', function () {
    return (
      '<div style="text-align: left;">Present in<br />' +
      this.get('profile.lists')
        .map((list) => {
          return '<i class="upf-icon upf-icon--influencers"></i> ' + list.get('name') + '<br />';
        })
        .join('') +
      '</div>'
    );
  }),

  displayContact: and('profile.email', 'hasInbox'),

  isLdaCompliant: gte('medias.instagram.audience.legal_drinking_age.values.21+', 0.716),

  didInsertElement() {
    this._super(...arguments);
    this.currentUser.fetch().then((payload) => {
      this.set('hasInbox', payload.user.granted_scopes.includes('inbox_client'));
    });
  }
});
