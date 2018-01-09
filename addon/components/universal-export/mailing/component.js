import ExternalExport from 'ember-upf-utils/components/universal-export/external/component';

export default ExternalExport.extend({
  layoutName: 'components/universal-export/external',

  _model: 'mailing',

  placeholder: 'Pick or create a mailing campaign',
  createOptionPlaceholder: 'Create <strong>#item#</strong> mailing campaign'
});
