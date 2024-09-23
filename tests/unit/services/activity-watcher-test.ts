/* eslint-disable  qunit/no-conditional-assertions */
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import EventsServiceMock from '@upfluence/hyperevents/test-support/services/events-service';

import sinon from 'sinon';

module('Unit | Service | activity-watcher', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:events-service', EventsServiceMock);

    this.eventService = this.owner.lookup('service:events-service');
    this.activityWatcher = this.owner.lookup('service:activity-watcher');
  });

  test('it does nothing if not watching', function (assert) {
    const toastInfoStub = sinon.stub(this.owner.lookup('service:toast'), 'info').returnsThis();
    const toastErrorStub = sinon.stub(this.owner.lookup('service:toast'), 'error').returnsThis();

    this.eventService.dispatch({ resource: '/notification/some-uu-id' });

    assert.true(toastErrorStub.notCalled);
    assert.true(toastInfoStub.notCalled);
  });

  module('watching for events', function (hooks) {
    hooks.beforeEach(function () {
      this.activityWatcher.watch();
    });

    const eventTypesTestCases = [
      {
        notification: {
          notification_type: 'mailing_email_received',
          timestamp: 123458,
          data: {
            influencer_name: 'bozito',
            influencer_avatar: 'https://avatar.com/is-a-bad-movie',
            entity_url: 'https://entity.url.com'
          }
        },
        wantInfoTitle: 'New email',
        wantInfoMessage: `You have a new email from bozito!<br>
          <a href="https://entity.url.com" target="_blank">Reply</a>`
      },
      {
        notification: {
          notification_type: 'conversation_email_received',
          timestamp: 123458,
          data: {
            influencer_name: 'bozito',
            influencer_avatar: 'https://avatar.com/is-a-bad-movie',
            entity_url: 'https://entity.url.com'
          }
        },
        wantInfoTitle: 'New email',
        wantInfoMessage: `You have a new email from bozito!<br>
          <a href="https://entity.url.com" target="_blank">Reply</a>`
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
        assert.expect(3);

        const infoStub = sinon
          .stub(this.owner.lookup('service:toast'), 'info')
          .callsFake((message: string, title: string) => {
            assert.true(trimAll(message).includes(trimAll(testCase.wantInfoMessage)));
            assert.equal(title, testCase.wantInfoTitle);
          });
        const errorStub = sinon
          .stub(this.owner.lookup('service:toast'), 'error')
          .callsFake((message: string, title: string) => {
            assert.true(trimAll(message).includes(trimAll(testCase.wantErrorMessage)));
            assert.equal(title, testCase.wantErrorTitle);
          });

        this.eventService.dispatch({
          resource: '/notification/some-uu-id',
          payload: testCase.notification
        });

        if (testCase.wantErrorTitle || testCase.wantErrorMessage) {
          assert.true(errorStub.calledOnce);
        }

        if (testCase.wantInfoTitle || testCase.wantInfoMessage) {
          assert.true(infoStub.calledOnce);
        }
      });
    });
  });
});

function trimAll(str: string): string {
  //@ts-ignore
  return str.replaceAll(' ', '');
}
/* eslint-enable  qunit/no-conditional-assertions */
