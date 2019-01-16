import Component from '@ember/component';
import { inject as service } from '@ember/service';
import layout from './template';


export default Component.extend({
  layout,

  featureFlagsManager: service(),

  tagName: '',

  didInsertElement() {
    this.featureFlagsManager.allow(this.requestedFeature).then((allowedFeature) => {
      this.set('allowedFeature', allowedFeature)
    });
  }
}).reopenClass({
  positionalParams: ['requestedFeature']
});
