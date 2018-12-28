import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  entityArchiving: service(),
  toast: service(),
  i18n: service(),

  _toastConfig: {
    timeOut: 0,
    extendedTimeOut: 0,
    closeButton: true,
    tapToDismiss: true
  },

  actions: {
    bulkArchive(archivalAction) {
      this.triggerAction({ action: 'setContentChanging', actionContext: true });
      this.get('entityArchiving').bulkToggleArchive(
        this.get('entityArchivingName'),
        this.get('selectedItems').mapBy('id'),
        archivalAction
      ).then(() => {
        let selectedItems = this.get('selectedItems');
        this.get('selectedItems').map((item) => item.set('selected', false));
        this.get('collection').removeObjects(selectedItems);
        this.triggerAction({
          action: 'setContentChanging',
          actionContext: false
        });
      }).catch(() => {
        this.triggerAction({
          action: 'setContentChanging',
          actionContext: false
        });
        this.get('toast').error(
          this.get('i18n').t(this.get('archivalError')),
          this.get('i18n').t(this.get('archivalErrorTitle')),
          this._toastConfig
        );
      });
    }
  }
});
