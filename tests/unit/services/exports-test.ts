import Service from '@ember/service';

import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

import Configuration from '@upfluence/ember-upf-utils/configuration';

const ACCESS_TOKEN = 'some-access-token';
const API_URL = `${Configuration.exportUrl}/api/v1`;

class SessionMock extends Service {
  data = { authenticated: { access_token: ACCESS_TOKEN } };
}

class CommunityThresholdManagerMock extends Service {
  processException = sinon.stub();
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

module('Unit | Service | exports', (hooks) => {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:session', SessionMock);
    this.owner.register('service:community-threshold-manager', CommunityThresholdManagerMock);

    this.communityThresholdManager = this.owner.lookup('service:community-threshold-manager');
    this.exports = this.owner.lookup('service:exports');
    this.fetchStub = sinon.stub(window, 'fetch');
  });

  module('accessToken', () => {
    test('It reads the access token from the session', function (assert) {
      assert.strictEqual(this.exports.accessToken, ACCESS_TOKEN);
    });
  });

  module('perform', () => {
    test('It posts the source and the destination to the export endpoint', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ status: 'scheduled' }));

      await this.exports.perform({ from: 'list:1' }, { to: 'campaign:2' });

      const [url, options] = this.fetchStub.firstCall.args;
      assert.strictEqual(url, `${API_URL}/export`);
      assert.strictEqual(options.method, 'POST');
      assert.deepEqual(JSON.parse(options.body), { source: { from: 'list:1' }, destination: { to: 'campaign:2' } });
    });

    test('It authenticates the request with a bearer token', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ status: 'scheduled' }));

      await this.exports.perform({ from: 'list:1' }, { to: 'campaign:2' });

      assert.strictEqual(this.fetchStub.firstCall.args[1].headers.get('Authorization'), `Bearer ${ACCESS_TOKEN}`);
    });

    test('It resolves with the parsed response', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ status: 'scheduled', total: 20 }));

      const result = await this.exports.perform({ from: 'list:1' }, { to: 'campaign:2' });

      assert.deepEqual(result, { status: 'scheduled', total: 20 });
    });

    test('It rejects with the parsed payload when the response is not ok', async function (assert) {
      assert.expect(1);

      this.fetchStub.resolves(jsonResponse({ error: 'threshold_reached' }, 402));

      await this.exports.perform({ from: 'list:1' }, { to: 'campaign:2' }).then(
        () => assert.ok(false, 'the promise should not resolve'),
        (payload: unknown) => assert.deepEqual(payload, { error: 'threshold_reached' })
      );
    });

    test('It forwards the failed payload to the community threshold manager', async function (assert) {
      assert.expect(1);

      this.fetchStub.resolves(jsonResponse({ error: 'threshold_reached' }, 402));

      await this.exports
        .perform({ from: 'list:1' }, { to: 'campaign:2' })
        .catch(() => undefined)
        .then(() => {
          assert.true(
            this.communityThresholdManager.processException.calledOnceWithExactly({ error: 'threshold_reached' })
          );
        });
    });

    test('It does not call the community threshold manager on success', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ status: 'scheduled' }));

      await this.exports.perform({ from: 'list:1' }, { to: 'campaign:2' });

      assert.true(this.communityThresholdManager.processException.notCalled);
    });
  });

  module('exportToEntities', () => {
    test('It sends the origin and the filters when no influencer is selected', async function (assert) {
      this.fetchStub.resolves(jsonResponse({}));

      await this.exports.exportToEntities('list:1', 'campaign:2', [], [{ name: 'tag', value: 'vip' }], 0, undefined);

      assert.deepEqual(JSON.parse(this.fetchStub.firstCall.args[1].body), {
        destination: { to: 'campaign:2' },
        source: { from: 'list:1', filters: [{ name: 'tag', value: 'vip' }] }
      });
    });

    test('It sends the influencer ids when some are selected', async function (assert) {
      this.fetchStub.resolves(jsonResponse({}));

      await this.exports.exportToEntities('list:1', 'campaign:2', [1, 2], [{ name: 'tag' }], 0, undefined);

      assert.deepEqual(JSON.parse(this.fetchStub.firstCall.args[1].body), {
        destination: { to: 'campaign:2' },
        source: { influencer_ids: [1, 2] }
      });
    });

    test('It sends the maximum size when it is set', async function (assert) {
      this.fetchStub.resolves(jsonResponse({}));

      await this.exports.exportToEntities('list:1', 'campaign:2', [1], [], 50, undefined);

      assert.deepEqual(JSON.parse(this.fetchStub.firstCall.args[1].body).source, {
        influencer_ids: [1],
        max_size: 50
      });
    });

    test('It sends the tags when they are set', async function (assert) {
      this.fetchStub.resolves(jsonResponse({}));

      await this.exports.exportToEntities('list:1', 'campaign:2', [1], [], 0, ['vip', 'new']);

      assert.deepEqual(JSON.parse(this.fetchStub.firstCall.args[1].body).destination, {
        to: 'campaign:2',
        tags: ['vip', 'new']
      });
    });

    test('It declares a JSON content type', async function (assert) {
      this.fetchStub.resolves(jsonResponse({}));

      await this.exports.exportToEntities('list:1', 'campaign:2', [1], [], 0, undefined);

      const headers = this.fetchStub.firstCall.args[1].headers;
      assert.strictEqual(headers.get('Content-Type'), 'application/json');
      assert.strictEqual(headers.get('Authorization'), `Bearer ${ACCESS_TOKEN}`);
    });

    test('It resolves with the parsed response', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ status: 'processed' }));

      const result = await this.exports.exportToEntities('list:1', 'campaign:2', [1], [], 0, undefined);

      assert.deepEqual(result, { status: 'processed' });
    });

    test('It rejects without a reason when the response is not ok', async function (assert) {
      assert.expect(1);

      this.fetchStub.resolves(jsonResponse({}, 500));

      await this.exports.exportToEntities('list:1', 'campaign:2', [1], [], 0, undefined).then(
        () => assert.ok(false, 'the promise should not resolve'),
        (reason: unknown) => assert.strictEqual(reason, undefined)
      );
    });
  });

  module('getFileExportURL', () => {
    test('It builds the file export URL with every parameter', function (assert) {
      const url = this.exports.getFileExportURL('list:1', 'csv', 'influencers', ['12', '34'], ['tag', 'city']);

      assert.strictEqual(
        url,
        `${API_URL}/export/file?from=list:1&influencer_ids=12,34&format=csv&type=influencers&` +
          `filters%5B%5D=tag&filters%5B%5D=city&access_token=${ACCESS_TOKEN}`
      );
    });

    test('It keeps an empty filter segment when no filter is given', function (assert) {
      const url = this.exports.getFileExportURL('list:1', 'csv', 'influencers', ['12'], []);

      assert.strictEqual(
        url,
        `${API_URL}/export/file?from=list:1&influencer_ids=12&format=csv&type=influencers&&access_token=${ACCESS_TOKEN}`
      );
    });

    test('It encodes the access token', function (assert) {
      this.exports.session.data.authenticated.access_token = 'a+b/c=';

      const url = this.exports.getFileExportURL('list:1', 'csv', 'influencers', ['12'], []);

      assert.strictEqual(
        url,
        `${API_URL}/export/file?from=list:1&influencer_ids=12&format=csv&type=influencers&&access_token=a%2Bb%2Fc%3D`
      );
    });

    test('It builds an empty influencer ids segment when none is given', function (assert) {
      const url = this.exports.getFileExportURL('list:1', 'csv', 'influencers', [], []);

      assert.strictEqual(
        url,
        `${API_URL}/export/file?from=list:1&influencer_ids=&format=csv&type=influencers&&access_token=${ACCESS_TOKEN}`
      );
    });
  });

  module('getLimit', () => {
    test('It requests the export limit', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ limit: 500, spent: 1 }));

      await this.exports.getLimit(sinon.stub());

      const [url, options] = this.fetchStub.firstCall.args;
      assert.strictEqual(url, `${API_URL}/export/file/limit`);
      assert.strictEqual(options.method, 'GET');
    });

    test('It calls back with the limit payload', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ limit: 500, spent: 1 }));
      const callback = sinon.stub();

      await this.exports.getLimit(callback);

      assert.true(callback.calledOnceWithExactly({ limit: 500, spent: 1 }));
    });

    test('It rejects and does not call back when the response is not ok', async function (assert) {
      assert.expect(1);

      this.fetchStub.resolves(jsonResponse({}, 500));
      const callback = sinon.stub();

      await this.exports.getLimit(callback).then(
        () => assert.ok(false, 'the promise should not resolve'),
        () => assert.true(callback.notCalled)
      );
    });
  });

  module('getAvailableExports', () => {
    test('It requests the discovery endpoint', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ sources: {}, destinations: {} }));

      await this.exports.getAvailableExports();

      const [url, options] = this.fetchStub.firstCall.args;
      assert.strictEqual(url, `${API_URL}/discovery`);
      assert.strictEqual(options.method, 'GET');
    });

    test('It resolves with the parsed response', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ sources: { entities: ['list'] } }));

      const result = await this.exports.getAvailableExports();

      assert.deepEqual(result, { sources: { entities: ['list'] } });
    });

    test('It rejects when the response is not ok', async function (assert) {
      assert.expect(1);

      this.fetchStub.resolves(jsonResponse({}, 500));

      await this.exports.getAvailableExports().then(
        () => assert.ok(false, 'the promise should not resolve'),
        (reason: unknown) => assert.strictEqual(reason, undefined)
      );
    });
  });

  module('searchEntities', () => {
    test('It searches entities by keyword', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ list: [] }));

      await this.exports.searchEntities('foo');

      const [url, options] = this.fetchStub.firstCall.args;
      assert.strictEqual(url, `${API_URL}/entities?s=foo`);
      assert.strictEqual(options.method, 'GET');
    });

    test('It appends the entity types when they are given', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ list: [] }));

      await this.exports.searchEntities('foo', ['list', 'campaign']);

      assert.strictEqual(this.fetchStub.firstCall.args[0], `${API_URL}/entities?s=foo&entity_types=list%2Ccampaign`);
    });

    test('It omits the entity types when the list is empty', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ list: [] }));

      await this.exports.searchEntities('foo', []);

      assert.strictEqual(this.fetchStub.firstCall.args[0], `${API_URL}/entities?s=foo`);
    });

    test('It encodes the keyword', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ list: [] }));

      await this.exports.searchEntities('rock & roll');

      assert.strictEqual(this.fetchStub.firstCall.args[0], `${API_URL}/entities?s=rock+%26+roll`);
    });

    test('It resolves with the parsed response', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ list: [{ id: 1 }] }));

      const result = await this.exports.searchEntities('foo');

      assert.deepEqual(result, { list: [{ id: 1 }] });
    });

    test('It rejects when the response is not ok', async function (assert) {
      assert.expect(1);

      this.fetchStub.resolves(jsonResponse({}, 500));

      await this.exports.searchEntities('foo').then(
        () => assert.ok(false, 'the promise should not resolve'),
        (reason: unknown) => assert.strictEqual(reason, undefined)
      );
    });
  });

  module('createEntity', () => {
    test('It posts the entity payload', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ id: 1 }));

      await this.exports.createEntity({ name: 'my list', type: 'list' }, sinon.stub());

      const [url, options] = this.fetchStub.firstCall.args;
      assert.strictEqual(url, `${API_URL}/entities`);
      assert.strictEqual(options.method, 'POST');
      assert.deepEqual(JSON.parse(options.body), { name: 'my list', type: 'list' });
      assert.strictEqual(options.headers.get('Content-Type'), 'application/json');
    });

    test('It calls back with the created entity', async function (assert) {
      this.fetchStub.resolves(jsonResponse({ id: 1, name: 'my list' }));
      const callback = sinon.stub();

      await this.exports.createEntity({ name: 'my list' }, callback);

      assert.true(callback.calledOnceWithExactly({ id: 1, name: 'my list' }));
    });

    test('It rejects and does not call back when the response is not ok', async function (assert) {
      assert.expect(1);

      this.fetchStub.resolves(jsonResponse({}, 500));
      const callback = sinon.stub();

      await this.exports.createEntity({ name: 'my list' }, callback).then(
        () => assert.ok(false, 'the promise should not resolve'),
        () => assert.true(callback.notCalled)
      );
    });
  });
});
