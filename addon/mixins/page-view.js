import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  router: service('router'),

  init() {
    this._super(...arguments);
    this.router.on('routeDidChange', (transition) => {
      if (transition.intent.name && window.ga) {
        window.ga(
          'send', 'pageview', this.router.urlFor(transition.intent.name)
        );
      }
    });
  }
});
