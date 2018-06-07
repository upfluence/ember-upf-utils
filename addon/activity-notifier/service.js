import Ember from 'ember';
import Configuration from 'ember-upf-utils/configuration';

const { Service, run, inject, computed, observer, getOwner } = Ember;

const NOTIFICATIONS = {
  mailing_email_received: true,
  conversation_email_received: true,
};

const messageWithAvatar = function(avatarUrl, message) {
  return `
    <div class="row">
      <div class="col-xs-2 text-center">
        <img class="upf-image upf-image--round-48" src="${avatarUrl}">
      </div>
      <div class="col-xs-10">
        ${message}
      </div>
    </div>
  `;
};

export default Service.extend({
  ajax: inject.service(),
  session: inject.service(),
  toast: inject.service(),

  _isRunning: false,
  _inFetch: false,
  _wait: 40 * 1000, // 40 seconds
  _from: 0,
  _environment: null,
  _scope: null,
  _timer: null,

  start() {
    if (this._isRunning || !this.get('hasToken')) {
      return;
    }

    this._environment = getOwner(this).resolveRegistration(
      'config:environment'
    ).environment;
    this._scope = Configuration.scope[0];
    this._isRunning = true;

    this.fetchNotifications();
  },

  stop() {
    this._isRunning = false;
    run.cancel(this._timer);
  },

  fetchNotifications() {
    if (!this._isRunning || this._inFetch) {
      return;
    }

    this._inFetch = true;

    this.get('ajax').request(this.buildUrl(), {
      dataType: 'json',
      data: this.buildArgs()
    }).then(
      (p) => {
        this._from = p.next;
        this.displayNotifications(p.notifications);
        this._timer = run.later(this, this.fetchNotifications, this._wait);
      }
    ).finally(
      () => { this._inFetch = false }
    );
  },

  buildUrl() {
    return `${Configuration.activityUrl}/notifications`;
  },

  buildArgs() {
    let query = {
      from: this._from,
      access_token: this.get('token'),
      scope: this._scope,
    };

    if (this._environment && this._environment !== 'production') {
      query.env = this._environment;
    }

    return query;
  },

  displayNotifications(notifications) {
    notifications.filter(
      (n) => NOTIFICATIONS[n.notification_type]
    ).forEach((n) => {
      let [title, message] = this.buildNotification(n);
      this.renderNotification(title, message);
    });
  },

  buildNotification(notification) {
    let data = notification.data || {};

    switch(notification.notification_type) {
      case 'mailing_email_received':
        return [
          'Email received in mailing',
          messageWithAvatar(
            data.influencer_avatar,
            `You have a new message from <b>${data.influencer_name}</b> in the
             <b>${data.entity_name}</b> campaign! 
             <a href="${data.entity_url}" target="_blank">Reply now</a>`
          )
        ];
      case 'conversation_email_received':
        return [
          'Email received',
          messageWithAvatar(
            data.influencer_avatar,
            `<b>${data.influencer_name}</b> has replied to your message! 
            <a href="${data.entity_url}" target="_blank">Respond now</a>`
          )
        ];
      default:
        throw `Can not display "${notification.notification_type}" notification`;
    }
  },

  renderNotification(title, message) {
    this.get('toast').success(message, title);
  },

  token: computed.alias('session.data.authenticated.access_token'),
  hasToken: computed.notEmpty('token'),

  _: observer('hasToken', function() {
    this.run();
  })
});
