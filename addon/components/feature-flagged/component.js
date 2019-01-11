import Component from '@ember/component';
import { inject as service } from '@ember/service';
import layout from './template';


export default Component.extend({
  layout,
  classNames: ['feature-flagged'],

  featureFlagsManager: service(),

  didInsertElement() {
    this.featureFlagsManager.allow(this.requestedFeature).then((allowedFeature) => {
      this.set('allowedFeature', allowedFeature)
    });
  }
}).reopenClass({
  positionalParams: ['requestedFeature']
});
