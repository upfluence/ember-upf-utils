import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';
import AuthorizedAjaxMixin from 'ember-upf-utils/mixins/authorized-ajax';

const {
  Service,
  computed
} = Ember;

export default AjaxService.extend(AuthorizedAjaxMixin, {
  namespace: '/api/v1',

  host: computed(function() {
    return getOwner(this).resolveRegistration(
      'config:environment'
    )['ember-upf-utils'].backendFacadeURL;
  }),

  fetchCampaigns() {
    return this.request('/campaigns', {
      method: 'GET',
      contentType: 'application/json'
    });
  }
});
