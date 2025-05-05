import Route from '@ember/routing/route';

const LIMIT_EXCEEDED = 'LimitExceeded';
const NOT_FOUND = 'NotFoundError';
const SERVER_ERROR = 'ServerError';

export default class HttpErrorsRoute extends Route {
  errorValue = null;

  templateName = 'http-errors';

  setupController(controller, error) {
    super.setupController(controller, error);

    // eslint-disable-next-line no-prototype-builtins
    if (error && error.hasOwnProperty('path')) {
      this.errorValue = NOT_FOUND;
    }

    if (error?.errors && error?.errors[0].status === 402) {
      this.errorValue = LIMIT_EXCEEDED;

      try {
        controller.setProperties({
          statusCode: error.errors[0].status,
          used: error.errors[0].limit_spent,
          limit: error.errors[0].limit_total
        });
        controller.httpError = '402';
      } catch (e) {
        controller.httpError = 'default';
      }

      return;
    }

    if (error && error.code) {
      this.errorValue = error.code;
    }

    if (this.errorValue === NOT_FOUND) {
      controller.httpError = '404';
    } else if (this.errorValue === SERVER_ERROR) {
      controller.httpError = '500';
    } else {
      controller.httpError = 'default';
    }
  }
}
