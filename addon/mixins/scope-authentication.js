import Mixin from '@ember/object/mixin';
import { reject, resolve } from 'rsvp';
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
      }

      this._super(...arguments);
    });
  }
});
