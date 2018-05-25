import Ember from 'ember';
import layout from './template';
import TooltipActivationMixin from 'ember-upf-utils/mixins/tooltip-activation';

const {
  Component,
  computed
} = Ember;

export default Component.extend(
  TooltipActivationMixin, {
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

    displayLists: computed('profile.lists', function () {
      if (this.get('profile.lists').length > 1) {
        return true
      }
    }),

    listNames: computed('profile.lists', function () {
      return '<div style="text-align: left;">Present in<br />' + this.get('profile.lists').map((list) => {
        return '<i class="upf-icon upf-icon--influencers"></i> ' + list.get('name') + '<br />';
      }).join('') + '</div>';
    })
  }
);
