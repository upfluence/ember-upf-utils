import Ember from 'ember';
import Configuration from 'ember-upf-utils/configuration';

const { Service, run, inject, computed, observer, getOwner } = Ember;

const messageWithAvatar = function(avatarUrl, message) {
  return {
    title: `<img class="toast-title__avatar" src="${avatarUrl}" />
     <i class="toast-title__icon upf-icon upf-icon--messages"></i>`,
    message: message
  };
};

export default Service.extend({
  ajax: inject.service(),
  session: inject.service(),
  toast: inject.service(),

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
          `You have a new message from <b>${data.influencer_name}</b> in the
           <b>${data.entity_name}</b> campaign! 
           <a href="${data.entity_url}" target="_blank">Reply now</a>`
        );
      case 'conversation_email_received':
        return messageWithAvatar(
          data.influencer_avatar,
          `<b>${data.influencer_name}</b> has replied to your message! 
           <a href="${data.entity_url}" target="_blank">Respond now</a>`
        );
      case 'direct_message_received':
        return messageWithAvatar(
          data.influencer_avatar,
          `<b>${data.influencer_name}</b> has replied to your direct message! 
           <a href="${data.entity_url}" target="_blank">Respond now</a>`
        );
      case 'publishr_application_received':
        return messageWithAvatar(
          data.influencer_avatar,
          `<b>${data.influencer_name}</b> has applied to your <b>${data.campaign_name}</b> campaign!
           <a href="${data.url}" target="_blank">Review the application now</a>`
        );
      case 'publishr_draft_created':
        return messageWithAvatar(
          data.influencer_avatar,
          `A new draft has been created by <b>${data.influencer_name}</b> for the <b>${data.campaign_name}</b> campaign!
           <a href="${data.url}" target="_blank">Review the draft now</a>`
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

  token: computed.alias('session.data.authenticated.access_token'),
  hasToken: computed.notEmpty('token'),

  _: observer('hasToken', function() {
    this.start();
  })
});
