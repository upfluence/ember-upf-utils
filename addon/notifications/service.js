import Ember from 'ember';
import Configuration from 'ember-upf-utils/configuration';

const {
  Service,
  computed,
  inject
} = Ember;

export default Service.extend({
  ajax: inject.service(),
  session: inject.service(),

  notificationReadURL: computed('session.data.authenticated.access_token', function() {
    const url = Configuration.meURL;
    const token = encodeURIComponent(
      this.get('session.data.authenticated.access_token')
    );

    return `${url}/notifications/mark_as_read?access_token=${token}`;
  }),

  markAsRead(model, notificationType) {
    let uuids = model.get('notifications').filterBy('type', notificationType)
                                          .mapBy('id');
    this.get('ajax').request(this.get('notificationReadURL'), {
      method: 'POST',
      data: { uuids }
    })
  }
});
