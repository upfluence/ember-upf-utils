import Route from '@ember/routing/route';

export function initialize() {
  Route.reopen({
    actions: {
      didTransition() {
        this._super(...arguments);

        if (window.ga) {
          window.ga('send', 'pageview', document.location.pathname);
        }
      }
    }
  })
}

export default {
  initialize
};
