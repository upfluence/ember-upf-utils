import EmberObject from '@ember/object';

import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

import Configuration from '@upfluence/ember-upf-utils/configuration';
import deactivatedAccountHandler from '@upfluence/ember-upf-utils/decorators/deactivated-account-handler';
import HttpErrorsRoute from '@upfluence/ember-upf-utils/http-errors/route';

const SETTINGS_URL = '#settings';
const ON_HOLD_ERROR = { errors: [{ code: 'on_hold' }] };

class ErrorRoute extends HttpErrorsRoute {}

const DecoratedErrorRoute = deactivatedAccountHandler(ErrorRoute);

module('Unit | Decorator | deactivated-account-handler', (hooks) => {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.originalSettingsURL = Configuration.settingsURL;
    Configuration.settingsURL = SETTINGS_URL;

    this.owner.register('route:decorated-error', DecoratedErrorRoute);
    this.route = this.owner.lookup('route:decorated-error');
    this.controller = EmberObject.create();
    this.transition = { abort: sinon.stub() };
  });

  hooks.afterEach(function () {
    Configuration.settingsURL = this.originalSettingsURL;
    window.location.hash = '';
  });

  module('Delegation', () => {
    test('It lets the decorated route handle the error', function (assert) {
      this.route.setupController(this.controller, { code: 'ServerError' }, this.transition);

      assert.strictEqual(this.controller.httpError, '500');
    });

    test('It lets the decorated route expose the model', function (assert) {
      const error = { code: 'ServerError' };

      this.route.setupController(this.controller, error, this.transition);

      assert.strictEqual(this.controller.model, error);
    });

    test('It lets the decorated route handle a deactivated account error', function (assert) {
      this.route.setupController(this.controller, ON_HOLD_ERROR, this.transition);

      assert.strictEqual(this.controller.httpError, 'default');
    });
  });

  module('Deactivated account', () => {
    test('It aborts the transition', function (assert) {
      this.route.setupController(this.controller, ON_HOLD_ERROR, this.transition);

      assert.true(this.transition.abort.calledOnce);
    });

    test('It redirects to the account settings page', function (assert) {
      this.route.setupController(this.controller, ON_HOLD_ERROR, this.transition);

      assert.strictEqual(window.location.hash, `${SETTINGS_URL}/accounts/me`);
    });
  });

  module('Active account', () => {
    test('It does not abort the transition for another error code', function (assert) {
      this.route.setupController(this.controller, { errors: [{ code: 'not_found' }] }, this.transition);

      assert.true(this.transition.abort.notCalled);
    });

    test('It does not abort the transition when the error carries no error list', function (assert) {
      this.route.setupController(this.controller, {}, this.transition);

      assert.true(this.transition.abort.notCalled);
    });

    test('It does not redirect when the account is active', function (assert) {
      this.route.setupController(this.controller, { errors: [{ code: 'not_found' }] }, this.transition);

      assert.strictEqual(window.location.hash, '');
    });
  });

  module('Unsupported errors', () => {
    test('It throws when there is no error', function (assert) {
      assert.throws(() => this.route.setupController(this.controller, undefined, this.transition), TypeError);
    });

    test('It throws when the error list is empty', function (assert) {
      assert.throws(() => this.route.setupController(this.controller, { errors: [] }, this.transition), TypeError);
    });
  });

  module('Applied to a bare route', (hooks) => {
    hooks.beforeEach(function () {
      class BareRoute {
        setupController(): void {
          return undefined;
        }
      }

      this.bareRoute = new (deactivatedAccountHandler(BareRoute))();
    });

    test('It does not abort the transition when the error list is empty', function (assert) {
      this.bareRoute.setupController(this.controller, { errors: [] }, this.transition);

      assert.true(this.transition.abort.notCalled);
    });

    test('It aborts the transition for a deactivated account', function (assert) {
      this.bareRoute.setupController(this.controller, ON_HOLD_ERROR, this.transition);

      assert.true(this.transition.abort.calledOnce);
    });
  });
});
