/*globals ga*/
import Ember from 'ember';
import layout from './template';

const {
  Component,
  inject,
  computed,
  getOwner
} = Ember;

export default Component.extend({
  layout,

  selectionStorage: inject.service(),
  exports: inject.service(),
  publishr: inject.service(),
  currentUser: inject.service(),
  toast: inject.service(),

  _toastConfig: {
    timeOut: 0,
    extendedTimeOut: 0,
    closeButton: true,
    tapToDismiss: true
  },
  tabs: {
    basic_file: true, // Using underscore case to match API response here
    full_file: false,
    mailing: false,
    campaign: false,
    stream: false
  },

  currentWindow: 'list',

  init() {
    this._super();

    this.get('exports').getAvailableExports().then((availableExports) => {
      Object.keys(this.get('tabs')).forEach((tab) => {
        this.set(`tabs.${tab}`, availableExports[tab]);
      });
    });

    ['file', 'list', 'publishr', 'mailing', 'stream'].forEach((e) => {
      this.set(`${e}Selected`, computed('currentWindow', function() {
        return this.get('currentWindow') === e;
      }));
    });
  },

  selectedCount: computed('selectedInfluencerIds', function() {
    let idsCount = this.get('selectedInfluencerIds.length');
    if (idsCount === 0) {
      idsCount = this.get('currentEntity.count');
    }
    return idsCount;
  }),

  _getSelectedInfluencers() {
    return this.get('influencers').filterBy('selected');
  },

  _toggleSelectedInfluencers() {
    this._getSelectedInfluencers().forEach((inf) => {
      inf.toggleProperty('selected');
    });
  },

  inboxURL: computed(function() {
    return getOwner(this).resolveRegistration(
      'config:environment'
    ).inboxURL;
  }),

  analyticsURL: computed(function() {
    return getOwner(this).resolveRegistration(
      'config:environment'
    ).analyticsURL;
  }),

  _mailingUrl(mailing, isNew) {
    if (!isNew) {
      return `${this.get('inboxURL')}mailings/${mailing.id}`;
    }

    return `${this.get('inboxURL')}mailings/edit/${mailing.id}`;
  },

  _streamUrl(stream) {
    return `${this.get('analyticsURL')}streams/${stream.id}`;
  },

  _exported(eventName, closeModal = true) {
    ga('send', 'event', 'Export', 'Submit', eventName);
    this._toggleSelectedInfluencers();
    this.get('selectionStorage').clear();
    if (closeModal) {
      this.sendAction('closeModal');
    }
  },

  actions: {
    setCurrent(tab) {
      this.set('currentWindow', tab);
    },

    performExport(to, defer) {
      let exportingFrom = `${this.get('currentEntityType')}:${this.get('currentEntity.id')}`;

      this.get('exports').exportToEntities(
        exportingFrom,
        to,
        this.get('selectedInfluencerIds')
      ).then(() => {
        defer.resolve();
        this.get('toast').success(
          'The influencers have been exported',
          'Success',
          this._toastConfig
        );
        this._exported(`Exported to ${to.split(' ')[0]}`);
      });
    },

    performFileExport(format, type) {
      let exportingFrom = `${this.get('currentEntityType')}:${this.get('currentEntity.id')}`;
      let eventName = format === 'csv' ? 'CSV Export' : 'Excel Export';

      let url = this.get('exports').getFileExportURL(
        exportingFrom,
        format,
        type,
        this.get('selectedInfluencerIds')
      );

      window.open(url, '_blank');
      this._exported(eventName);
    }
  }
});
