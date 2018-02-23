import Ember from 'ember';
import Configuration from 'ember-upf-utils/configuration';

const {
  Service,
  RSVP,
  computed,
  inject
} = Ember;

export default Service.extend({
  ajax: inject.service(),
  session: inject.service(),

  notificationReadURL: computed('session.data.authenticated.access_token', function() {
    let token = encodeURIComponent(
      this.get('session.data.authenticated.access_token')
    );

    return `${Configuration.meURL}/notifications/mark_as_read?access_token=${token}`;
  }),

  markAsRead(model, notificationTypes) {
    let notifications = model.get('notifications').filter((notification) => {
      return notificationTypes.includes(notification.get('type'));
    });

    return new RSVP.Promise((resolve, reject) => {
      this.get('ajax').request(this.get('notificationReadURL'), {
        method: 'POST',
        data: { uuids: notifications.mapBy('id') }
      }).then((user) => resolve(notifications))
        .catch((e) => reject(e));
    });
  }
});
