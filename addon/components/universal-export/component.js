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

  init() {
    this._super();

    this.exports.getAvailableExports().then((availableExports) => {
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
          return this.currentWindow === e;
        })
      );
    });
  },

  selectedInfluencerIds: mapBy('selectedInfluencers', 'id'),

  selectedCount: computed(
    '(this.currentEntity).count', 'currentEntity.count', 'selectedInfluencerIds.length', function() {
      let idsCount = this.get('selectedInfluencerIds.length');
      if (idsCount === 0 && this.currentEntity) {
        idsCount = this.currentEntity.count;
      }
      return idsCount;
    }
  ),

  _getSelectedInfluencers() {
    return this.influencers.filterBy('selected');
  },

  _toggleSelectedInfluencers() {
    this._getSelectedInfluencers().forEach((inf) => {
      inf.toggleProperty('selected');
    });
  },

  _exported(closeModal = true) {
    if (this.didExport) {
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
      let exportingFrom = `${this.currentEntityType}:${this.get('currentEntity.id')}`;

      this.exports.exportToEntities(
        exportingFrom,
        to,
        this.selectedInfluencerIds,
        this.filters,
      ).then((data) => {
        defer.resolve();
        this._onSuccessfullExport(to);

        if (data.status === 'scheduled') {
          this.toast.info(
            `${data.total} influencers are being exported.`,
            'Export in progress',
            this._toastConfig
          );
        } else {
          this.toast.success(
            `${data.total} influencers have been exported.`,
            'Export completed',
            this._toastConfig
          );
        }

        this._exported();
      });
    },

    performFileExport(format, type) {
      let exportingFrom = `${this.currentEntityType}:${this.get('currentEntity.id')}`;
      let url = this.exports.getFileExportURL(
        exportingFrom,
        format,
        type,
        this.selectedInfluencerIds,
        this.filters
      );

      window.open(url, '_blank');
      this._exported();
    }
  }
});
