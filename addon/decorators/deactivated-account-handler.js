import Configuration from '@upfluence/ember-upf-utils/configuration';

export default function deactivatedAccountHandler(Class) {
  return class DeactivatedAccountHandler extends Class {
    setupController(controller, error) {
      super.setupController(controller, error);

      if (error.errors && error.errors[0] && error.errors[0].code === 'on_hold') {
        window.location = `${Configuration.identityURL}accounts/me`;
      }
    }
  };
}
