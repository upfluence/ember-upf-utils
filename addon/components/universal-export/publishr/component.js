/*globals ga*/
import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  inject,
  isEmpty
} = Ember;

export default Component.extend({
  layout,
  publishr: inject.service(),

  campaigns: computed(function() {
    return this.get('publishr').fetchCampaigns();
  }),

  disabledCampaignExport: computed(
    'campaign',
    'selectedInfluencerIds',
    function() {
      return isEmpty(this.get('campaign'));
    }
  ),

  actions: {
    submit(params, defer) {
      let campaign = params[0];

      this.triggerAction({
        action: 'performExport',
        actionContext: [`campaign:${campaign.id}`, defer]
      });
    },

    closeModal() {
      ga('send', 'event', 'Header', 'Submit', 'Cancel');
      this.sendAction('closeModal');
    }
  }
});
