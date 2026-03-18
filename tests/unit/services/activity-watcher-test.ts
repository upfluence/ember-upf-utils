/* eslint-disable  qunit/no-conditional-assertions */
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import EventsServiceMock from '@upfluence/hyperevents/test-support/services/events-service';

import sinon from 'sinon';
import Service from '@ember/service';

import { setupToast } from '@upfluence/oss-components/test-support';
import { setupIntl } from 'ember-intl/test-support';

class SessionServiceMock extends Service {
  tooManyConnections: boolean = false;

  invalidate = sinon.stub();
}

module('Unit | Service | activity-watcher', function (hooks) {
  setupTest(hooks);
  setupToast(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:events-service', EventsServiceMock);
    this.owner.register('service:session', SessionServiceMock);

    this.eventService = this.owner.lookup('service:events-service');
    this.sessionService = this.owner.lookup('service:session');
    this.activityWatcher = this.owner.lookup('service:activity-watcher');
  });

  test('it does nothing if not watching', function (assert) {
    this.eventService.dispatch({ resource: '/notification/some-uu-id' });

    assert.true(this.toastErrorStub.notCalled);
    assert.true(this.toastInfoStub.notCalled);
  });

  module('watching for events', function (hooks) {
    hooks.beforeEach(function () {
      this.activityWatcher.watch();
    });

    test('When an event of type "token_destroyed" is received, it invalidates the session if the token is the same', function (assert) {
      this.sessionService.data = { authenticated: { access_token: 'some-token' } };

      this.eventService.dispatch({
        resource: '/notification/some-uu-id',
        payload: {
          notification_type: 'token_destroyed',
          data: {
            access_token: 'some-token'
          }
        }
      });

      assert.true(this.sessionService.invalidate.calledOnce);
    });

    const eventTypesTestCases = [
      {
        notification: {
          notification_type: 'email_received',
          timestamp: 123458,
          data: {
            influencer_name: 'bozito',
            influencer_avatar: 'https://avatar.com/is-a-bad-movie',
            entity_url: 'https://entity.url.com'
          }
        },
        wantInfoTitle: 'New email',
        wantInfoMessage: `You have a new email from bozito!<br><a href="https://entity.url.com" target="_blank">Reply</a>`
      },
      {
        notification: {
          notification_type: 'email_received',
          timestamp: 123458,
          data: {
            influencer_name: 'bozito',
            influencer_avatar: 'https://avatar.com/is-a-bad-movie',
            entity_url: 'https://entity.url.com'
          }
        },
        wantInfoTitle: 'New email',
        wantInfoMessage: `You have a new email from bozito!<br><a href="https://entity.url.com" target="_blank">Reply</a>`
      },
      {
        notification: {
          notification_type: 'direct_message_received',
          timestamp: 123458,
          data: {
            influencer_name: 'bozito',
            influencer_avatar: 'https://avatar.com/is-a-bad-movie',
            entity_url: 'https://entity.url.com'
          }
        },
        wantInfoTitle: 'New message',
        wantInfoMessage: `Message from <b>bozito</b>
           <a href="https://entity.url.com" target="_blank">Reply</a>`
      },
      {
        notification: {
          notification_type: 'publishr_application_received',
          timestamp: 123458,
          data: {
            influencer_name: 'bozito',
            influencer_avatar: 'https://avatar.com/is-a-bad-movie',
            campaign_name: 'bozocampaign',
            url: 'https://entity.url.com'
          }
        },
        wantInfoTitle: 'New application',
        wantInfoMessage: `Application from <b>bozito</b> in <b>bozocampaign</b>
           <a href="https://entity.url.com" target="_blank">See application</a>`
      },
      {
        notification: {
          notification_type: 'publishr_draft_created',
          timestamp: 123458,
          data: {
            influencer_name: 'bozito',
            influencer_avatar: 'https://avatar.com/is-a-bad-movie',
            campaign_name: 'bozocampaign',
            url: 'https://entity.url.com'
          }
        },
        wantInfoTitle: 'New draft',
        wantInfoMessage: `Draft by <b>bozito</b> in <b>bozocampaign</b>
           <a href="https://entity.url.com" target="_blank">Review</a>`
      },
      {
        notification: {
          notification_type: 'list_recommendation',
          timestamp: 123458,
          data: {
            count: 20,
            list_name: 'bozolist',
            url: 'https://entity.url.com'
          }
        },
        wantInfoTitle: 'New recommendations',
        wantInfoMessage: `You have <b>20</b> new recommendations for your <b>bozolist</b> list
           <a href="https://entity.url.com" target="_blank">View</a>`
      },
      {
        notification: {
          notification_type: 'thread_failure_summary',
          timestamp: 123458,
          data: {
            mailing_url: 'https://entity.url.com'
          }
        },
        wantErrorTitle: 'Thread failure',
        wantErrorMessage: `<b>Mailing error.</b> We ran into a problem with one of your Mailings.
          <a href="https://entity.url.com" target="_blank">View my mailing</a>`
      },
      {
        notification: {
          notification_type: 'credential_disconnected',
          timestamp: 123458,
          data: {
            integration_name: 'woop',
            integration_url: 'https://inte-gration.com'
          }
        },
        wantErrorTitle: 'Integration disconnected',
        wantErrorMessage: `<b>Your woop has been disconnected.</b> Please check your integration settings and reconnect it to avoid any issues.
          <a href="https://inte-gration.com" target="_blank">Reconnect</a>`
      }
    ];

    eventTypesTestCases.forEach((testCase: any) => {
      test('it dispatches events for ' + testCase.notification.notification_type, function (assert) {
        assert.expect(2);

        this.eventService.dispatch({
          resource: '/notification/some-uu-id',
          payload: testCase.notification
        });

        if (testCase.wantErrorTitle || testCase.wantErrorMessage) {
          assert.equal(
            this.toastErrorStub.firstCall.args[0].toString(),
            this.intl.t(`notifications.${testCase.notification.notification_type}.description`, {
              ...testCase.notification.data,
              htmlSafe: true
            })
          );
          assert.equal(this.toastErrorStub.firstCall.args[1], testCase.wantErrorTitle);
        }

        if (testCase.wantInfoTitle || testCase.wantInfoMessage) {
          assert.equal(
            this.toastInfoStub.firstCall.args[0].toString(),
            this.intl.t(`notifications.${testCase.notification.notification_type}.description`, {
              ...testCase.notification.data,
              htmlSafe: true
            })
          );
          assert.equal(this.toastInfoStub.firstCall.args[1], testCase.wantInfoTitle);
        }
      });
    });
  });
});
/* eslint-enable  qunit/no-conditional-assertions */
