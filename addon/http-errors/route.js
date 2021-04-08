import Route from '@ember/routing/route';
import { getOwner } from '@ember/application';

const LIMIT_EXCEEDED = 'LimitExceeded';
const NOT_FOUND = 'NotFoundError';
const RESOURCE_NOT_FOUND = 'Resource was not found.';
const SERVER_ERROR = 'ServerError';

export default class HttpErrorsRoute extends Route {
  errorValue = null;

  setupController(controller, error) {
    super.setupController(controller, error);

    if (error.errors && error.errors[0].status === 402) {
      this.errorValue = LIMIT_EXCEEDED;
      this.statusCode = error.errors[0].status;
      this.used = error.errors[0].limit_spent;
      this.limit = error.errors[0].limit_total;
      return;
    }

    if (error && error.code) {
      this.errorValue = error.code;
      return;
    }

    if (error && error.message) {
      this.errorValue = error.message;
    }
  }

  renderTemplate() {
    switch (this.errorValue) {
      case NOT_FOUND:
      case RESOURCE_NOT_FOUND:
        this.render(`http-errors.404`);
        break;
      case SERVER_ERROR:
        this.render(`http-errors.500`);
        break;
      case LIMIT_EXCEEDED:
        try {
          let controller = getOwner(this).lookup('controller:http-errors.402');
          controller.setProperties({
            statusCode: this.statusCode,
            used: this.used,
            limit: this.limit
          });
          this.render(`http-errors.402`);
        } catch (e) {
          this.render(`http-errors`);
        }
        break;
      default:
        this.render(`http-errors`);
    }
  }
}
