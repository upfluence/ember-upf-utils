import Route from '@ember/routing/route';

export default class HttpErrorsRoute extends Route {
  errorCode = null;

  setupController(controller, error) {
    super.setupController(controller, error);
    if (error && error.code) {
      this.errorCode = error.code;
    }
  }

  renderTemplate() {
    switch (this.errorCode) {
      case 'NotFoundError':
        this.render(`http-errors.404`);
        break;
      case 'ServerError':
        this.render(`http-errors.500`);
        break;
      default:
        super.renderTemplate();
    }
  }
}
