import Mixin from '@ember/object/mixin';
import { resolve } from 'rsvp';
import { inject as service } from '@ember/service';

export default Mixin.create({
  featureFlagsManager: service(),

  neededScope: null,
  notAllowedRoute: 'not-found',

  beforeModel(transition) {
    return this.featureFlagsManager.allow(this.neededScope).then((allowed) => {
      if (!allowed) {
        transition.abort();
        this.transitionTo(this.notAllowedRoute);
        resolve();
      } else {
        return this._super(...arguments);
      }
    });
  }
});
