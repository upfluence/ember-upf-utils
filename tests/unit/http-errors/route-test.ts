import EmberObject from '@ember/object';

import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import HttpErrorsRoute from '@upfluence/ember-upf-utils/http-errors/route';

interface ErrorController {
  httpError?: string;
  statusCode?: number;
  used?: number;
  limit?: number;
  model?: unknown;
}

module('Unit | Route | http-errors', (hooks) => {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('route:http-errors', HttpErrorsRoute);
    this.route = this.owner.lookup('route:http-errors');
    this.controller = EmberObject.create();
  });

  module('Template', () => {
    test('It renders the shared http-errors template', function (assert) {
      assert.strictEqual(this.route.templateName, 'http-errors');
    });
  });

  module('Not found', () => {
    test('It reports a 404 when the error carries a path', function (assert) {
      this.route.setupController(this.controller, { path: '/missing' });

      assert.strictEqual(this.controller.httpError, '404');
    });

    test('It reports a 404 when the error code is NotFoundError', function (assert) {
      this.route.setupController(this.controller, { code: 'NotFoundError' });

      assert.strictEqual(this.controller.httpError, '404');
    });
  });

  module('Server error', () => {
    test('It reports a 500 when the error code is ServerError', function (assert) {
      this.route.setupController(this.controller, { code: 'ServerError' });

      assert.strictEqual(this.controller.httpError, '500');
    });
  });

  module('Limit exceeded', () => {
    test('It reports a 402 when the first error has a 402 status', function (assert) {
      this.route.setupController(this.controller, { errors: [{ status: 402 }] });

      assert.strictEqual(this.controller.httpError, '402');
    });

    test('It exposes the consumption details on the controller', function (assert) {
      this.route.setupController(this.controller, {
        errors: [{ status: 402, limit_spent: 90, limit_total: 100 }]
      });

      assert.strictEqual(this.controller.statusCode, 402);
      assert.strictEqual(this.controller.used, 90);
      assert.strictEqual(this.controller.limit, 100);
    });

    test('It takes precedence over the error code', function (assert) {
      this.route.setupController(this.controller, { code: 'ServerError', errors: [{ status: 402 }] });

      assert.strictEqual(this.controller.httpError, '402');
    });

    test('It falls back to the default error when the controller rejects the properties', function (assert) {
      const controller: ErrorController = {};

      this.route.setupController(controller, { errors: [{ status: 402 }] });

      assert.strictEqual(controller.httpError, 'default');
    });

    test('It throws when the error list is empty', function (assert) {
      assert.throws(() => this.route.setupController(this.controller, { errors: [] }), TypeError);
    });
  });

  module('Default error', () => {
    test('It reports the default error when there is no error', function (assert) {
      this.route.setupController(this.controller, undefined);

      assert.strictEqual(this.controller.httpError, 'default');
    });

    test('It reports the default error when the error is null', function (assert) {
      this.route.setupController(this.controller, null);

      assert.strictEqual(this.controller.httpError, 'default');
    });

    test('It reports the default error for an empty error', function (assert) {
      this.route.setupController(this.controller, {});

      assert.strictEqual(this.controller.httpError, 'default');
    });

    test('It reports the default error for an unknown error code', function (assert) {
      this.route.setupController(this.controller, { code: 'SomethingElse' });

      assert.strictEqual(this.controller.httpError, 'default');
    });

    test('It reports the default error when the first error status is not 402', function (assert) {
      this.route.setupController(this.controller, { errors: [{ status: 500 }] });

      assert.strictEqual(this.controller.httpError, 'default');
    });
  });

  module('Model', () => {
    test('It exposes the error as the controller model', function (assert) {
      const error = { code: 'ServerError' };

      this.route.setupController(this.controller, error);

      assert.strictEqual(this.controller.model, error);
    });
  });

  module('Retained state', () => {
    test('It keeps the previous error kind when a later error carries none', function (assert) {
      this.route.setupController(this.controller, { path: '/missing' });
      const nextController = EmberObject.create() as ErrorController;

      this.route.setupController(nextController, {});

      assert.strictEqual(nextController.httpError, '404');
    });
  });
});
