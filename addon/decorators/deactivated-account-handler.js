import Configuration from '@upfluence/ember-upf-utils/configuration';

export default function deactivatedAccountHandler(Class) {
  return class DeactivatedAccountHandler extends Class {
    setupController(controller, error, transition) {
      super.setupController(controller, error, transition);

      if (error.errors && error.errors[0] && error.errors[0].code === 'on_hold') {
        transition.abort();
        window.location = `${Configuration.settingsURL}/accounts/me`;
      }
    }
  };
}
