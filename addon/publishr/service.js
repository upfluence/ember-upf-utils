import Ember from 'ember';

const {
  Service,
  inject
} = Ember;

export default Service.extend({
  ajax: inject.service(),

  fetchCampaigns() {
    return this.get('ajax').request('/campaigns', {
      method: 'GET',
      contentType: 'application/json'
    });
  }
});
