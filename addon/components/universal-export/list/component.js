/*globals ga*/
import ExternalExport from 'ember-upf-utils/components/universal-export/external/component';


export default ExternalExport.extend({
  layoutName: 'components/universal-export/external',

  _model: 'list',

  placeholder: 'Pick or create a list',
  createOptionPlaceholder: 'Create <strong>#item#</strong> list'
});
