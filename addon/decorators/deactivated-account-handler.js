export default function deactivatedAccountHandler(Class) {
  return class DeactivatedAccountHandler extends Class {
    setupController(controller, error) {
      super.setupController(controller, error);

      //TODO: Change that with variable based on environnement
      const identityURL = 'https://user.upfluence.co/';

      if (error.errors && error.errors[0] && error.errors[0].code === 'on_hold') {
        window.location = `${identityURL}accounts/billing?status=on_hold`;
      }
    }
  };
}
