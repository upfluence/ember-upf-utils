import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

class SessionServiceStub extends Service {
  data = { authenticated: { access_token: 'foobar' } };
}

module('Unit | Service | authenticated-requester-service', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:session', SessionServiceStub);
    this.authenticatedService = this.owner.lookup('service:authenticated-requester-service');
  });

  test('it returns the correct accessToken', function (assert) {
    assert.equal(this.authenticatedService.accessToken, 'foobar');
  });

  test('it returns the correct Authorization headers', function (assert) {
    const authorizationHeaders = this.authenticatedService.headers.get('Authorization');
    assert.equal(authorizationHeaders, 'Bearer foobar');
  });
});
