import Component from '@ember/component';
import { computed } from '@ember/object';
import { GLOBAL_SUPPORT_LINK } from '@upfluence/ember-upf-utils/resources/helpdesk-links';
import { inject as service } from '@ember/service';

const INFLUENCER_NETWORK_MODAL_COOKIE = 'upf_disable_influencer_modal';

export default Component.extend({
  currentUser: service(),
  user: null,

  init() {
    this._super();
    this.currentUser.fetch().then((user) => {
      this.set('user', user);
    });
  },

  displayInfluencerNetworkModal: computed(
    'hasDisabledInfluencerNetworkModal',
    'hideInfluencerNetworkModal',
    'user.companies.firstObject.billing_format',
    function () {
      return (
        !this.hasDisabledInfluencerNetworkModal &&
        !this.hideInfluencerNetworkModal &&
        this.user &&
        this.user.companies &&
        this.user.companies.firstObject.billing_format != 'bracket'
      );
    }
  ),

  hasDisabledInfluencerNetworkModal: computed(function () {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith(INFLUENCER_NETWORK_MODAL_COOKIE))
      ?.split('=')[1];

    return cookieValue;
  }),

  actions: {
    dontShowInfluencerNetworkModal(disableModal) {
      this.toggleProperty('hasDisabledInfluencerNetworkModal');

      document.cookie = `${INFLUENCER_NETWORK_MODAL_COOKIE}=${disableModal ? true : ''}`;
    },

    openSupportLink() {
      window.open(GLOBAL_SUPPORT_LINK, '_blank');
    }
  }
});
