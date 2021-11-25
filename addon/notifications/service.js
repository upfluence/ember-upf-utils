import Service, { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import Configuration from '@upfluence/ember-upf-utils/configuration';
import { computed } from '@ember/object';
import { isArray } from '@ember/array';
import { getOwner } from '@ember/application';

export default Service.extend({
  ajax: service(),
  session: service(),

  notificationReadURL: computed('session.data.authenticated.access_token', function () {
    let token = encodeURIComponent(this.get('session.data.authenticated.access_token'));

    return `${Configuration.meURL}/notifications/mark_as_read?access_token=${token}`;
  }),

  _extractNotifications(modelOrCollection) {
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
  },

  markAsRead(modelOrCollection, notificationTypes) {
    let notifications = this._extractNotifications(modelOrCollection);
    notifications = notifications.filter((notification) => {
      return notificationTypes.includes(notification.get('type'));
    });

    return new RSVP.Promise((resolve, reject) => {
      this.ajax
        .request(this.notificationReadURL, {
          method: 'POST',
          data: { uuids: notifications.mapBy('id') }
        })
        .then(() => resolve(notifications))
        .catch((e) => reject(e));
    });
  },

  fetchFeed(field, environment) {
    return this.ajax.request(this.fetchFeedUrl(field), {
      method: 'GET',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${this.get('session.data.authenticated.access_token')}`
      }
    });
  },

  fetchFeedUrl(field, environment) {
    let _environment = getOwner(this).resolveRegistration('config:environment').build_env;

    return `${Configuration.activityUrl}notifications/feed?field=${field}&env=${_environment}`;
  }
});
