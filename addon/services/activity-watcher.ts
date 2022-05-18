import Service from '@ember/service';
import { inject as service } from '@ember/service';

import { Observable } from '@upfluence/hyperevents/helpers/observable';
import EventsService, { ResourceEvent, prefixPath } from '@upfluence/hyperevents/services/events-service';
import ToastService, { ToastOptions } from '@upfluence/oss-components/services/toast';

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

function renderNotificationMessage(title: string, message: string): RenderedNotification {
  return {
    title: title,
    message: message,
    type: 'info'
  };
}

function renderNotificationErrorMessage(message: string, title: string): RenderedNotification {
  return {
    title: title,
    message: message,
    type: 'error'
  };
}

function renderNotificationMessageWithAvatar(message: string, title: string, avatarUrl: string): RenderedNotification {
  return {
    title: title,
    message: message,
    type: 'info',
    avatarUrl: avatarUrl
  };
}

type NotificationRendererMap = {
  [key: string]: (data: any) => RenderedNotification;
};

const renderersByNotificationType: NotificationRendererMap = {
  mailing_email_received: (data: any) => {
    return renderNotificationMessageWithAvatar(
      `Email from <b>${data.influencer_name}</b>
       <a href="${data.entity_url}" target="_blank">Reply</a>`,
      'New email',
      data.influencer_avatar
    );
  },
  conversation_email_received: (data: any) => {
    return renderNotificationMessageWithAvatar(
      `Email from <b>${data.influencer_name}</b>
       <a href="${data.entity_url}" target="_blank">Reply</a>`,
      'New email',
      data.influencer_avatar
    );
  },
  direct_message_received: (data: any) => {
    return renderNotificationMessageWithAvatar(
      `Message from <b>${data.influencer_name}</b>
       <a href="${data.entity_url}" target="_blank">Reply</a>`,
      'New message',
      data.influencer_avatar
    );
  },
  publishr_application_received: (data: any) => {
    return renderNotificationMessageWithAvatar(
      `Application from <b>${data.influencer_name}</b> in <b>${data.campaign_name}</b>
       <a href="${data.url}" target="_blank">See application</a>`,
      'New application',
      data.influencer_avatar
    );
  },
  publishr_draft_created: (data: any) => {
    return renderNotificationMessageWithAvatar(
      `Draft by <b>${data.influencer_name}</b> in <b>${data.campaign_name}</b>
       <a href="${data.url}" target="_blank">Review</a>`,
      'New draft',
      data.influencer_avatar
    );
  },
  list_recommendation: (data: any) => {
    return renderNotificationMessage(
      `You have <b>${data.count}</b> new recommendations for your <b>${data.list_name}</b> list
       <a href="${data.url}" target="_blank">View</a>`,
      'New recommendations'
    );
  },
  thread_failure_summary: (data: any) => {
    return renderNotificationErrorMessage(
      `<b>Mailing error.</b> We ran into a problem with one of your Mailings.
         <a href="${data.mailing_url}" target="_blank">View my mailing</a>`,
      'Thread failure'
    );
  },
  credential_disconnected: (data: any) => {
    return renderNotificationErrorMessage(
      `<b>Your ${data.integration_name} has been disconnected.</b> Please check your integration.
      settings and reconnect it to avoid any issues. <a href="${data.integration_url}" target="_blank">Reconnect</a>`,
      'Integration disconnected'
    );
  }
};

export default class ActivityWatcher extends Service {
  @service declare eventsService: EventsService;
  @service declare toast: ToastService;

  private declare _observer: Observable<ResourceEvent> | null;

  watch(): void {
    if (this._observer) {
      return;
    }

    this._observer = this.eventsService.watch(prefixPath('/notification'));
    this._observer.subscribe((evt: NotificationEvent) => {
      this._processEvent(evt);
    });
  }

  unwatch(): void {
    if (!this._observer) {
      return;
    }

    this._observer.unsubscribe();
    this._observer = null;
  }

  private _processEvent(evt: NotificationEvent): void {
    const notif = this._buildNotification(evt);

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

  private _buildNotification(evt: NotificationEvent): RenderedNotification | null {
    const renderer = renderersByNotificationType[evt.payload.notification_type];

    if (!renderer) {
      return null;
    }

    return renderer(evt.payload.data || {});
  }
}

declare module '@ember/service' {
  interface Registry {
    'activity-watcher': ActivityWatcher;
  }
}
