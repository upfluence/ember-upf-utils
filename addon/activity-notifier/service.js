import { alias, notEmpty } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import { observer } from '@ember/object';
import { getOwner } from '@ember/application';
import Configuration from '@upfluence/ember-upf-utils/configuration';

const notificationMessage = function (message) {
  return {
    title: `<i class="toast-title__icon upf-icon upf-icon--messages"></i>`,
    message: message,
    type: 'info'
  };
};

const notificationErrorMessage = function (message) {
  return {
    title: `<i class="toast-title__icon upf-icon upf-icon--messages"></i>`,
    message: message,
    type: 'error'
  };
};

const notificationMessageWithAvatar = function (avatarUrl, message) {
  return {
    title: `<img class="toast-title__avatar" src="${avatarUrl}" />
     <i class="toast-title__icon upf-icon upf-icon--messages"></i>`,
    message: message,
    type: 'info'
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
    if (this._isRunning || !this.hasToken) {
      this.stop();

      return;
    }

    this._environment = getOwner(this).resolveRegistration('config:environment').build_env;
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

    this.ajax
      .request(this.buildUrl(), {
        dataType: 'json',
        data: this.buildArgs()
      })
      .then((p) => {
        this._from = p.next;
        this.displayNotifications(p.notifications);
        this._timer = run.later(this, this.fetchNotifications, this.waitTime());
      })
      .finally(() => {
        this._inFetch = false;
      });
  },

  buildUrl() {
    return `${Configuration.activityUrl}notifications`;
  },

  buildArgs() {
    let query = {
      from: this._from,
      access_token: this.token,
      scope: this._scope
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
    (notifications || []).forEach((n) => {
      let d = this.buildNotification(n);

      if (!d) {
        return;
      }

      this.renderNotification(d);
    });
  },

  buildNotification(notification) {
    let data = notification.data || {};

    switch (notification.notification_type) {
      case 'mailing_email_received':
        return notificationMessageWithAvatar(
          data.influencer_avatar,
          `Email from <b>${data.influencer_name}</b>
          <a href="${data.entity_url}" target="_blank">Reply</a>`
        );
      case 'conversation_email_received':
        return notificationMessageWithAvatar(
          data.influencer_avatar,
          `Email from <b>${data.influencer_name}</b>
           <a href="${data.entity_url}" target="_blank">Reply</a>`
        );
      case 'direct_message_received':
        return notificationMessageWithAvatar(
          data.influencer_avatar,
          `Message from <b>${data.influencer_name}</b>
           <a href="${data.entity_url}" target="_blank">Reply</a>`
        );
      case 'publishr_application_received':
        return notificationMessageWithAvatar(
          data.influencer_avatar,
          `Application by <b>${data.influencer_name}</b> in  <b>${data.campaign_name}</b>
           <a href="${data.url}" target="_blank">See application</a>`
        );
      case 'publishr_draft_created':
        return notificationMessageWithAvatar(
          data.influencer_avatar,
          `Draft by <b>${data.influencer_name}</b> in <b>${data.campaign_name}</b>
           <a href="${data.url}" target="_blank">Review</a>`
        );
      case 'list_recommendation':
        return notificationMessage(
          `You have <b>${data.count}</b> new recommendations for your <b>${data.list_name}</b> list
           <a href="${data.url}" target="_blank">View</a>`
        );
      case 'thread_failure_summary':
        return notificationErrorMessage(
          `<b>Mailing error.</b> We ran into a problem with one of your Mailings. 
          <a href="${data.mailing_url}" target="_blank"><b>View my mailing</b></a>`
        );
      case 'credential_disconnected':
        return notificationErrorMessage(
          `<b>Your ${data.integration_name} has been disconnected.</b> Please check your integration 
          settings and reconnect it to avoid any issues. <a href="${data.integration_url}" target="_blank"><b>Reconnect</b></a>`
        );
      default:
        return null;
    }
  },

  renderNotification(notification) {
    this.toast[notification.type](notification.message, notification.title, {
      timeOut: 0,
      extendedTimeOut: 0
    });
  },

  token: alias('session.data.authenticated.access_token'),
  hasToken: notEmpty('token'),

  _: observer('hasToken', function () {
    this.start();
  })
});
