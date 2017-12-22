import Ember from 'ember';

const {
  Mixin,
  inject
} = Ember;

export default Mixin.create({
  entityArchiving: inject.service(),
  toast: inject.service(),
  i18n: inject.service(),

  _toastConfig: {
    timeOut: 0,
    extendedTimeOut: 0,
    closeButton: true,
    tapToDismiss: true
  },

  actions: {
    bulkArchive(archivalAction) {
      this.get('entityArchiving').bulkToggleArchive(
        this.get('entityArchivingName'),
        this.get('selectedItems').mapBy('id'),
        archivalAction
      ).then(() => {
        this.get('selectedItems').map((item) => item.set('selected', false));
        this.get('collection').removeObjects(this.get('selectedItems'));
      }).catch(() => {
        this.get('toast').error(
          this.get('i18n').t(this.get('archivalError')),
          this.get('i18n').t(this.get('archivalErrorTitle')),
          this._toastConfig
        );
      });
    }
  }
});
