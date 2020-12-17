import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { get, defineProperty, computed } from '@ember/object';
import { mapBy } from '@ember/object/computed';
import layout from './template';

const EXTERNAL_EXPORTS = ['list', 'mailing', 'campaign', 'stream'];

export default Component.extend({
  layout,

  selectionStorage: service(),
  exports: service(),
  toast: service(),
  currentUser: service(),

  _toastConfig: {
    timeOut: 0,
    extendedTimeOut: 0,
    closeButton: true,
    tapToDismiss: true
  },

  tabs: {
    external: false,
    file: true,
    overlap_file: false,
    full_file: false
  },

  currentWindow: 'file',
  filters: [],
  hideInfluencerNetworkModal: true,
  hasEmailRevealScope: false,

  init() {
    this._super();

    this.get('currentUser').fetch().then((response) => {
      this.set(
        'hasEmailRevealScope',
        response.user.granted_scopes.includes('reveal_email')
      );
    });

    this.get('exports').getAvailableExports().then((availableExports) => {
      this.set(
        'tabs.external',
        Object.keys(availableExports)
          .filter((x) => availableExports[x])
          .some((e) => EXTERNAL_EXPORTS.includes(e))
      );

      ['overlap_file', 'full_file'].forEach((exportType) => {
        this.set(`tabs.${exportType}`, availableExports[exportType]);
      });

      this.set('currentWindow', this.tabs.external ? 'external' : 'file');
    });

    ['file', 'external'].forEach((e) => {
      defineProperty(
        this,
        `${e}Selected`,
        computed('currentWindow', function() {
          return this.get('currentWindow') === e;
        })
      );
    });
  },

  selectedInfluencerIds: mapBy('selectedInfluencers', 'id'),

  selectedCount: computed(
    'selectedInfluencerIds',
    'currentEntity',
    'currentEntity.count', function() {
      let idsCount = this.get('selectedInfluencerIds.length');
      if (idsCount === 0 && this.get('currentEntity')) {
        idsCount = get(this.get('currentEntity'), 'count');
      }
      return idsCount;
    }
  ),

  _getSelectedInfluencers() {
    return this.get('influencers').filterBy('selected');
  },

  _toggleSelectedInfluencers() {
    this._getSelectedInfluencers().forEach((inf) => {
      inf.toggleProperty('selected');
    });
  },

  _exported(closeModal = true) {
    if (this.get('didExport')) {
      this.sendAction('didExport');
    }
    if (closeModal) {
      this.closeModal();
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
      ).then((data) => {
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

          if(this.hasEmailRevealScope) {
            this.toggleProperty('hideInfluencerNetworkModal');
          }
        }

        this._exported();
      });
    },

    toggleInfluencerNetworkModal() {
      this.toggleProperty('hideInfluencerNetworkModal')
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
