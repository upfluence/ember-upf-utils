import Route from '@ember/routing/route';

export default class HttpErrorsRoute extends Route {
  errorValue = null;

  setupController(controller, error) {
    super.setupController(controller, error);
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
      case 'NotFoundError':
      case 'Resource was not found.':
        this.render(`http-errors.404`);
        break;
      case 'ServerError':
        this.render(`http-errors.500`);
        break;
      default:
        this.render(`http-errors`);
    }
  }
}
