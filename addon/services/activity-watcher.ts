import Service from '@ember/service';
import { inject as service } from '@ember/service';

import { Observable } from '@upfluence/hyperevents/helpers/observable';
import EventsService, { ResourceEvent, prefixPath } from '@upfluence/hyperevents/services/events-service';
import ToastService, { ToastOptions } from '@upfluence/oss-components/services/toast';
import { IntlService } from 'ember-intl';

type NotificationEvent = {
  resource: string;
  payload: {
    notification_type: string;
    timestamp: number;
    data: any;
  };
};

type RenderedNotification = {
  title: string;
  message: string;
  type: string;
  avatarUrl?: string;
};

function renderNotificationMessage(message: string, title: string): RenderedNotification {
  return {
    title,
    message,
    type: 'info'
  };
}

function renderNotificationErrorMessage(message: string, title: string): RenderedNotification {
  return {
    title,
    message,
    type: 'error'
  };
}

function renderNotificationMessageWithAvatar(message: string, title: string, avatarUrl: string): RenderedNotification {
  return {
    title,
    message,
    type: 'info',
    avatarUrl: avatarUrl
  };
}

type NotificationRendererMap = {
  [key: string]: (data: any, intl?: IntlService) => RenderedNotification;
};

const renderersByNotificationType: NotificationRendererMap = {
  mailing_email_received: (data: any, intl: IntlService) => {
    return renderNotificationMessageWithAvatar(
      intl.t('notifications.mailing_email_received.description', {
        influencer_name: data.influencer_name,
        entity_url: data.entity_url
      }),
      intl.t('notifications.mailing_email_received.title'),
      data.influencer_avatar
    );
  },
  conversation_email_received: (data: any, intl: IntlService) => {
    return renderNotificationMessageWithAvatar(
      intl.t('notifications.conversation_email_received.description', {
        influencer_name: data.influencer_name,
        entity_url: data.entity_url
      }),
      intl.t('notifications.conversation_email_received.title'),
      data.influencer_avatar
    );
  },
  direct_message_received: (data: any, intl: IntlService) => {
    return renderNotificationMessageWithAvatar(
      intl.t('notifications.direct_message_received.description', {
        influencer_name: data.influencer_name,
        entity_url: data.entity_url
      }),
      intl.t('notifications.direct_message_received.title'),
      data.influencer_avatar
    );
  },
  publishr_application_received: (data: any, intl: IntlService) => {
    return renderNotificationMessageWithAvatar(
      intl.t('notifications.publishr_application_received.description', {
        influencer_name: data.influencer_name,
        campaign_name: data.campaign_name,
        url: data.url
      }),
      intl.t('notifications.publishr_application_received.title'),
      data.influencer_avatar
    );
  },
  publishr_draft_created: (data: any, intl: IntlService) => {
    return renderNotificationMessageWithAvatar(
      intl.t('notifications.publishr_draft_created.description', {
        influencer_name: data.influencer_name,
        campaign_name: data.campaign_name,
        url: data.url
      }),
      intl.t('notifications.publishr_draft_created.title'),
      data.influencer_avatar
    );
  },
  list_recommendation: (data: any, intl: IntlService) => {
    return renderNotificationMessage(
      intl.t('notifications.list_recommendation.description', {
        count: data.count,
        list_name: data.list_name,
        url: data.url
      }),
      intl.t('notifications.list_recommendation.title')
    );
  },
  thread_failure_summary: (data: any, intl: IntlService) => {
    return renderNotificationErrorMessage(
      intl.t('notifications.thread_failure_summary.description', {
        mailing_url: data.mailing_url
      }),
      intl.t('notifications.thread_failure_summary.title')
    );
  },
  credential_disconnected: (data: any, intl: IntlService) => {
    return renderNotificationErrorMessage(
      intl.t('notifications.credential_disconnected.description', {
        integration_name: data.integration_name,
        integration_url: data.integration_url
      }),
      intl.t('notifications.credential_disconnected.title')
    );
  }
};

export default class ActivityWatcher extends Service {
  @service declare eventsService: EventsService;
  @service declare toast: ToastService;
  @service declare intl: IntlService;
  @service declare session: any;

  private declare _observer: Observable<ResourceEvent> | null;

  watch(): void {
    if (this._observer) {
      return;
    }

    this._observer = this.eventsService.watch(prefixPath('/notification'));
    this._observer.subscribe((evt: NotificationEvent) => {
      this.processEvent(evt);
    });
  }

  unwatch(): void {
    if (!this._observer) {
      return;
    }

    this._observer.unsubscribe();
    this._observer = null;
  }

  private processEvent(evt: NotificationEvent): void {
    if (evt.payload.notification_type === 'token_destroyed') {
      this.checkIfUserNeedsToBeDisconnected(evt);
      return;
    }
    const notif = this.buildNotification(evt);

    if (!notif) {
      return;
    }

    let toastOpts: ToastOptions | undefined = undefined;
    if (notif.avatarUrl) {
      toastOpts = { badge: { image: notif.avatarUrl } };
    }

    switch (notif.type) {
      case 'info':
        this.toast.info(notif.message, notif.title, toastOpts);
        break;
      case 'error':
        this.toast.error(notif.message, notif.title, toastOpts);
        break;
    }
  }

  private checkIfUserNeedsToBeDisconnected(event: NotificationEvent): void {
    if (this.session.data.authenticated.access_token === event.payload.data.access_token) {
      this.session.tooManyConnections = true;
      this.session.invalidate();
    }
  }

  private buildNotification(evt: NotificationEvent): RenderedNotification | null {
    const renderer = renderersByNotificationType[evt.payload.notification_type];

    if (!renderer) {
      return null;
    }

    return renderer(evt.payload.data, this.intl || {});
  }
}

declare module '@ember/service' {
  interface Registry {
    'activity-watcher': ActivityWatcher;
  }
}
