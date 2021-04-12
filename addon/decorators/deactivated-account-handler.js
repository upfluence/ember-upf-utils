//TODO: Change that with variable based on environnement
const IDENTITY_URL = 'https://user.upfluence.co/';

export default function deactivatedAccountHandler(Class) {
  return class DeactivatedAccountHandler extends Class {
    setupController(controller, error) {
      super.setupController(controller, error);

      if (error.errors && error.errors[0] && error.errors[0].code === 'on_hold') {
        window.location = `${IDENTITY_URL}accounts/billing?status=on_hold`;
      }
    }
  };
}
