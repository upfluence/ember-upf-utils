/*globals ga*/
import Ember from 'ember';
import layout from './template';

const {
  Component,
  inject,
  computed,
  get,
  getOwner
} = Ember;

export default Component.extend({
  layout,

  selectionStorage: inject.service(),
  exports: inject.service(),
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
  filters: [],

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

  selectedInfluencerIds: computed.mapBy('selectedInfluencers', 'id'),

  selectedCount: computed('selectedInfluencerIds', 'currentEntity', function() {
    let idsCount = this.get('selectedInfluencerIds.length');
    if (idsCount === 0 && this.get('currentEntity')) {
      idsCount = get(this.get('currentEntity'), 'count');
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

  _exported(closeModal = true) {
    this.sendAction('didExport');
    if (closeModal) {
      this.sendAction('closeModal');
    }
  },

  _onSuccessfullExport(to) {
    let [type, id] = to.split(':');
    let callbackFuncName = `${type}CreationCallback`;

    if (this.get(callbackFuncName)) {
      this.sendAction(callbackFuncName, type, id);
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
        this.get('selectedInfluencerIds'),
        this.get('filters'),
      ).then(() => {
        defer.resolve();
        this._onSuccessfullExport(to);

        if (data.status === 'scheduled') {
          this.get('toast').info(
            `${data.total} influencers are being exported.`,
            'Export in progress',
            this._toastConfig
          );
        } else {
          this.get('toast').success(
            `${data.total} influencers have been exported.`,
            'Export completed',
            this._toastConfig
          );
        }

        this._exported();
      });
    },

    performFileExport(format, type) {
      let exportingFrom = `${this.get('currentEntityType')}:${this.get('currentEntity.id')}`;
      let url = this.get('exports').getFileExportURL(
        exportingFrom,
        format,
        type,
        this.get('selectedInfluencerIds'),
        this.get('filters')
      );

      window.open(url, '_blank');
      this._exported();
    }
  }
});
