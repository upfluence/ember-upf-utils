import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  entityArchiving: service(),
  toast: service(),
  intl: service(),

  _toastConfig: {
    timeOut: 0,
    extendedTimeOut: 0,
    closeButton: true,
    tapToDismiss: true
  },

  actions: {
    bulkArchive(archivalAction) {
      this.triggerAction({ action: 'setContentChanging', actionContext: true });
      this.entityArchiving
        .bulkToggleArchive(this.entityArchivingName, this.selectedItems.mapBy('id'), archivalAction)
        .then(() => {
          let selectedItems = this.selectedItems;
          this.selectedItems.map((item) => item.set('selected', false));
          this.collection.removeObjects(selectedItems);
          this.triggerAction({
            action: 'setContentChanging',
            actionContext: false
          });
        })
        .catch(() => {
          this.triggerAction({
            action: 'setContentChanging',
            actionContext: false
          });
          this.toast.error(this.intl.t(this.archivalError), this.intl.t(this.archivalErrorTitle), this._toastConfig);
        });
    }
  }
});
