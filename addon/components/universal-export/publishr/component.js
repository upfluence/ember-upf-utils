import ExternalExport from 'ember-upf-utils/components/universal-export/external/component';

export default ExternalExport.extend({
  layoutName: 'components/universal-export/external',

  _model: 'campaign',
  _canCreate: false,

  placeholder: 'Pick an influencer campaign'
});
