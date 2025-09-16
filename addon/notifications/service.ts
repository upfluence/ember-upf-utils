import Service, { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import Configuration from '@upfluence/ember-upf-utils/configuration';
import { isArray } from '@ember/array';
import { getOwner } from '@ember/application';
import Model from '@ember-data/model';
import DS from 'ember-data';

type ModelWithNotifications = Model & {
  notifications: DS.ManyArray<Notification>;
};

export default class NotificationsService extends Service {
  @service declare ajax: any;
  @service declare session: any;

  get headers(): Headers {
    let headers = { Authorization: `Bearer ${this.accessToken}`, 'Content-Type': 'application/json' };
    return new Headers(headers);
  }

  get notificationReadURL(): string {
    let token = encodeURIComponent(this.accessToken);
    return `${Configuration.meURL}/notifications/mark_as_read?access_token=${token}`;
  }

  markAsRead(modelOrCollection: any[], notificationTypes: string[]): Promise<any> {
    let notifications = this.extractNotifications(modelOrCollection);
    notifications = notifications.filter((notification: any) => {
      return notificationTypes.includes(notification.get('type'));
    });

    const params = new URLSearchParams();
    notifications.forEach((notification: any) => {
      params.append('uuids[]', notification.id);
    });

    return new RSVP.Promise((resolve, reject) => {
      fetch(this.notificationReadURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: params
      }).then((response) => {
        if (!response.ok) {
          return reject();
        }
        return resolve(notifications);
      });
    });
  }

  fetchFeed(field: string): Promise<any> {
    return fetch(this.fetchFeedUrl(field), { method: 'GET', headers: this.headers }).then((response) => {
      if (!response.ok) {
        return Promise.reject();
      }
      return response.json();
    });
  }

  private extractNotifications(modelOrCollection: ModelWithNotifications | ModelWithNotifications[]): any {
    if (isArray(modelOrCollection)) {
      return modelOrCollection
        .map((m) => {
          return m.get('notifications').toArray();
        })
        .reduce((acc, notifications) => {
          acc = acc.concat(notifications);
          return acc;
        }, []);
    } else {
      return modelOrCollection.get('notifications');
    }
  }

  private get accessToken(): string {
    return this.session.data.authenticated.access_token;
  }

  private fetchFeedUrl(field: string): string {
    const _environment = getOwner(this).resolveRegistration('config:environment').build_env;

    return `${Configuration.activityUrl}notifications/feed?field=${field}&env=${_environment}`;
  }
}

declare module '@ember/service' {
  interface Registry {
    notifications: NotificationsService;
  }
}
