import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

const INFLUENCER_NETWORK_MODAL_COOKIE = "upf_disable_influencer_modal";

export default Component.extend({
  layout,

  hasDisabledInfluencerNetworkModal: computed(function() {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(INFLUENCER_NETWORK_MODAL_COOKIE))
      ?.split('=')[1];

    return cookieValue;
  }),

  actions: {
    dontShowInfluencerNetworkModal(disableModal) {
      this.toggleProperty('hasDisabledInfluencerNetworkModal');

      document.cookie = `${INFLUENCER_NETWORK_MODAL_COOKIE}=${disableModal ? true : ''}`;
    },

    closeInfluencerNetworkModal() {
      this.toggleProperty('hideInfluencerNetworkModal')
    }
  }
});
