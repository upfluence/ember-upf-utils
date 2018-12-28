import { alias, notEmpty } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import { observer } from '@ember/object';
import { getOwner } from '@ember/application';
import Configuration from 'ember-upf-utils/configuration';

const messageWithAvatar = function(avatarUrl, message) {
  return {
    title: `<img class="toast-title__avatar" src="${avatarUrl}" />
     <i class="toast-title__icon upf-icon upf-icon--messages"></i>`,
    message: message
  };
};

export default Service.extend({
  ajax: service(),
  session: service(),
  toast: service(),

  _isRunning: false,
  _inFetch: false,
  _defaultWait: 5,
  _from: 0,
  _environment: null,
  _scope: null,
  _timer: null,

  start() {
    if (this._isRunning || !this.get('hasToken')) {
      this.stop();

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

    if (this._timer) {
      run.cancel(this._timer);
    }
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
        this._timer = run.later(this, this.fetchNotifications, this.waitTime());
      }
    ).finally(
      () => { this._inFetch = false; }
    );
  },

  buildUrl() {
    return `${Configuration.activityUrl}notifications`;
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

  waitTime() {
    return (Configuration.notificationWait || this._defaultWait) * 1000;
  },

  displayNotifications(notifications) {
    notifications.forEach((n) => {
      let d = this.buildNotification(n);

      if (!d) {
        return;
      }

      this.renderNotification(d.title, d.message);
    });
  },

  buildNotification(notification) {
    let data = notification.data || {};

    switch(notification.notification_type) {
      case 'mailing_email_received':
        return messageWithAvatar(
          data.influencer_avatar,
          `Email from <b>${data.influencer_name}</b>
          <a href="${data.entity_url}" target="_blank">Reply</a>`
        );
      case 'conversation_email_received':
        return messageWithAvatar(
          data.influencer_avatar,
          `Email from <b>${data.influencer_name}</b>
           <a href="${data.entity_url}" target="_blank">Reply</a>`
        );
      case 'direct_message_received':
        return messageWithAvatar(
          data.influencer_avatar,
          `Message from <b>${data.influencer_name}</b>
           <a href="${data.entity_url}" target="_blank">Reply</a>`
        );
      case 'publishr_application_received':
        return messageWithAvatar(
          data.influencer_avatar,
          `Application by <b>${data.influencer_name}</b> in  <b>${data.campaign_name}</b>
           <a href="${data.url}" target="_blank">See application</a>`
        );
      case 'publishr_draft_created':
        return messageWithAvatar(
          data.influencer_avatar,
          `Draft by <b>${data.influencer_name}</b> in <b>${data.campaign_name}</b>
           <a href="${data.url}" target="_blank">Review</a>`
        );
      default:
        return null;
    }
  },

  renderNotification(title, message) {
    this.get('toast').info(message, title, {
      timeOut: 0,
      extendedTimeOut: 0
    });
  },

  token: alias('session.data.authenticated.access_token'),
  hasToken: notEmpty('token'),

  _: observer('hasToken', function() {
    this.start();
  })
});
