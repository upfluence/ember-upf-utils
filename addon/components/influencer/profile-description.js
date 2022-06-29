import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { gt, and, gte } from '@ember/object/computed';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import layout from './template';
import TooltipActivationMixin from '@upfluence/ember-upf-utils/mixins/tooltip-activation';

const FALLBACK_IMAGE = '/assets/images/no-image.svg';

export default Component.extend(TooltipActivationMixin, {
  currentUser: service(),

  layout,
  classNames: ['profile-description'],

  profilePictureLoaded: false,
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

  bgImgStyle: computed('profilePictureLoaded', 'profile.avatarUrl', function () {
    return this.profilePictureLoaded
      ? htmlSafe(`background-image: url(${this.get('profile.avatarUrl')}), url(${FALLBACK_IMAGE});`)
      : htmlSafe(`background-image: url(${FALLBACK_IMAGE});`);
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

  responseTimeScore: computed('medias.processedFeatures.response_time_score', function () {
    let responseTimeScore = this.medias?.get('processedFeatures.response_time_score');

    if (!responseTimeScore) {
      return;
    }

    return parseInt((responseTimeScore / 3600).toFixed()) || 1;
  }),

  isInInboxWeb: computed(function () {
    return getOwner(this).resolveRegistration('config:environment').modulePrefix === '@upfluence/inbox-web';
  }),

  responseTimeSpeed: computed('responseTimeScore', function () {
    if (this.responseTimeScore >= 48) {
      return 'alert';
    } else if (this.responseTimeScore >= 24) {
      return 'regular';
    }

    return 'success';
  }),

  responseTimeSkin: computed('responseTimeSpeed', function () {
    switch (this.responseTimeSpeed) {
      case 'alert':
        return 'warning';
      case 'regular':
        return 'primary';
      default:
        return 'success';
    }
  }),

  actions: {
    imageHasLoaded() {
      this.set('profilePictureLoaded', true);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.currentUser.fetch().then((payload) => {
      this.set('hasInbox', payload.user.granted_scopes.includes('inbox_client'));
    });
  }
});
