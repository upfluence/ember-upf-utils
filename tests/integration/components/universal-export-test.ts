import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, setupOnerror, waitFor } from '@ember/test-helpers';
import Service from '@ember/service';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
// @ts-ignore
import { clickTrigger, selectChoose } from 'ember-power-select/test-support/helpers';

import ExportServiceMock, { SCHEDULED_EXPORT_RESPONSE } from '@upfluence/ember-upf-utils/test-support/services/exports';

class CurrentUserServiceStub extends Service {
  async fetchOwnerships() {
    return [];
  }
  async fetch() {
    return ;
  }
}

module('Integration | Component | universal-export', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:current-user', CurrentUserServiceStub);
    this.owner.register('service:exports', ExportServiceMock);
    this.currentEntity = { id: 4, count: 667 };
    this.currentEntityType = 'list';
    this.filters = [{ name: 'foo', value: 'bar' }];
    this.selectedInfluencers = [{ id: 37 }, { id: 45 }];
  });

  function stubDestinationsDiscovery(context: any, entityTypes: string[], fileTypes: string[]) {
    sinon.stub(context.owner.lookup('service:exports'), 'getAvailableExports').callsFake(() => {
      return Promise.resolve({
        destinations: {
          entities: entityTypes,
          files: fileTypes
        },
        sources: {
          entities: []
        }
      });
    });
  }

  test('it throws an error if no selectedInfluencers nor currentEntity is passed', async function (assert) {
    setupOnerror((err: Error) => {
      assert.equal(
        err.message,
        '[component/universal-export] Either @selectedInfluencers or @currentEntity/@currentEntityType args must be provided'
      );
    });

    await render(hbs`<UniversalExport />`);
  });

  test('nothing is displayed if @hidden args is truthy', async function (assert: Assert) {
    await render(
      hbs`<UniversalExport @hidden={{true}} @currentEntity={{this.currentEntity}} @currentEntityType={{this.currentEntityType}} />`
    );

    assert.dom('.modal').doesNotExist();
  });

  test('the export modal is displayed if @hidden args is falsy', async function (assert: Assert) {
    await render(
      hbs`<UniversalExport @hidden={{false}} @currentEntity={{this.currentEntity}} @currentEntityType={{this.currentEntityType}} />`
    );

    assert.dom('.modal').exists();
  });

  module('available tabs and export types', function () {
    test('the external tab is not displayed if the discovery responded with no entity destinations', async function (assert: Assert) {
      stubDestinationsDiscovery(this, [], []);
      await render(
        hbs`<UniversalExport @hidden={{false}} @currentEntity={{this.currentEntity}} @currentEntityType={{this.currentEntityType}} />`
      );
      assert.dom('.modal .nav.nav-tabs li').exists({ count: 1 });
      assert.dom('.modal .nav.nav-tabs li a').hasText('File');
    });

    test('the file tab supports basic files export', async function (assert: Assert) {
      stubDestinationsDiscovery(this, ['campaign'], []);
      await render(
        hbs`<UniversalExport @hidden={{false}} @currentEntity={{this.currentEntity}} @currentEntityType={{this.currentEntityType}} />`
      );
      assert.dom('.modal .nav.nav-tabs li:first-child a').hasText('In-App');
      assert.dom('.modal .nav.nav-tabs li:last-child a').hasText('File');
    });

    test('the files tab only contains the basic file export if no extra file exports is available', async function (assert: Assert) {
      stubDestinationsDiscovery(this, [], []);
      render(
        hbs`<UniversalExport @hidden={{false}} @currentEntity={{this.currentEntity}} @currentEntityType={{this.currentEntityType}} />`
      );
      await waitFor('.modal .modal-body');
      assert.dom('.modal .modal-body [data-control-name="influencer_file_export_type_radio_buttons"]').doesNotExist();
      assert.dom('.modal .modal-body [data-control-name="influencer_file_export_formats_radio_buttons"]').exists();
    });

    test('the file tab supports extra file exports listed in the discovery', async function (assert: Assert) {
      stubDestinationsDiscovery(this, ['campaign'], ['overlap_file', 'full_file']);
      render(
        hbs`<UniversalExport @hidden={{false}} @currentEntity={{this.currentEntity}} @currentEntityType={{this.currentEntityType}} />`
      );
      await waitFor('.modal .modal-body');
      await click('[data-control-name="influencer_export_file_tab"]');
      assert.dom('.modal .modal-body [data-control-name="influencer_file_export_type_radio_buttons"]').exists();
      assert.dom(' [data-control-name="influencer_file_export_type_radio_buttons"] label').exists({ count: 3 });
      assert.dom(' [data-control-name="influencer_file_export_type_radio_buttons"] label:first-child').hasText('Basic');
      assert
        .dom(' [data-control-name="influencer_file_export_type_radio_buttons"] label:nth-child(2)')
        .hasText('Overlap');
      assert.dom(' [data-control-name="influencer_file_export_type_radio_buttons"] label:nth-child(3)').hasText('All');
    });
  });

  module('closure actions', function () {
    test('closure actions are invoked after successful export', async function (assert: Assert) {
      sinon.stub(this.owner.lookup('service:toast'), 'success');
      stubDestinationsDiscovery(this, ['list'], []);

      this.didExport = () => {
        assert.ok(true, 'entered the didExport callback');
      };

      this.closeModal = () => {
        assert.ok(true, 'entered the closeModal callback');
      };

      render(
        hbs`
            <UniversalExport
              @hidden={{false}} @currentEntity={{this.currentEntity}} @currentEntityType={{this.currentEntityType}}
              @didExport={{this.didExport}} @closeModal={{this.closeModal}} />
          `
      );

      await waitFor('.modal .modal-body');
      await clickTrigger();
      await selectChoose('.ember-power-select-trigger', 'foo list');
      await click('.modal .modal-footer .upf-btn.upf-btn--primary');

      assert.expect(2);
    });
  });

  module('perfoming entity exports', function () {
    module('entity source', function () {
      test('it correctly handles a processed export request with filters', async function (assert: Assert) {
        const exportsRequestSpy = sinon.spy(this.owner.lookup('service:exports'), 'perform');
        sinon.stub(this.owner.lookup('service:toast'), 'success').callsFake((message: string, title: string) => {
          assert.equal(message, '2 influencers have been exported.');
          assert.equal(title, 'Export completed');
        });
        stubDestinationsDiscovery(this, ['list'], []);

        this.filters = [{ name: 'foo', value: 'bar' }];
        render(
          hbs`
            <UniversalExport
              @hidden={{false}} @currentEntity={{this.currentEntity}} @currentEntityType={{this.currentEntityType}}
              @filters={{this.filters}} />
          `
        );

        await waitFor('.modal .modal-body');
        await clickTrigger();
        await selectChoose('.ember-power-select-trigger', 'foo list');
        await click('.modal .modal-footer .upf-btn.upf-btn--primary');

        // @ts-ignore
        assert.ok(
          exportsRequestSpy.calledWith({ from: 'list:4', filters: [{ name: 'foo', value: 'bar' }] }, { to: 'list:1' })
        );
      });

      test('it behaves right when the export is still scheduled', async function (assert: Assert) {
        sinon.stub(this.owner.lookup('service:exports'), 'perform').callsFake((source: any, destination: any) => {
          assert.deepEqual(source, { from: 'list:4', filters: [{ name: 'foo', value: 'bar' }] });
          assert.deepEqual(destination, { to: 'list:1' });
          return Promise.resolve(SCHEDULED_EXPORT_RESPONSE);
        });
        sinon.stub(this.owner.lookup('service:toast'), 'info').callsFake((message: string, title: string) => {
          assert.equal(message, '20 influencers are being exported.');
          assert.equal(title, 'Export in progress');
        });
        stubDestinationsDiscovery(this, ['list'], []);

        render(
          hbs`
            <UniversalExport
              @hidden={{false}} @currentEntity={{this.currentEntity}} @currentEntityType={{this.currentEntityType}}
              @filters={{this.filters}} />
          `
        );

        await waitFor('.modal .modal-body');
        await clickTrigger();
        await selectChoose('.ember-power-select-trigger', 'foo list');
        await click('.modal .modal-footer .upf-btn.upf-btn--primary');
      });
    });

    module('influencers source', function () {
      test('it correctly handles a processed export request', async function (assert: Assert) {
        const originalExport = this.owner.lookup('service:exports').perform;
        sinon.stub(this.owner.lookup('service:exports'), 'perform').callsFake((source: any, destination: any) => {
          assert.deepEqual(source, { influencer_ids: [37, 45] });
          assert.deepEqual(destination, { to: 'list:1' });
          return originalExport(source, destination);
        });
        sinon.stub(this.owner.lookup('service:toast'), 'success').callsFake((message: string, title: string) => {
          assert.equal(message, '2 influencers have been exported.');
          assert.equal(title, 'Export completed');
        });
        stubDestinationsDiscovery(this, ['list'], []);

        render(hbs` <UniversalExport @hidden={{false}} @selectedInfluencers={{this.selectedInfluencers}} />`);

        await waitFor('.modal .modal-body');
        await clickTrigger();
        await selectChoose('.ember-power-select-trigger', 'foo list');
        await click('.modal .modal-footer .upf-btn.upf-btn--primary');
      });
    });
  });
});
