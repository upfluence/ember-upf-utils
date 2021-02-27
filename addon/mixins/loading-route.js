import { scheduleOnce } from '@ember/runloop';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  _notifyInfinityModelLoading() {
    if (!this.infinityModelLoading) { return; }
    return scheduleOnce('afterRender', this, 'infinityModelLoading');
  },

  _loadNextPage() {
    let self = this;
    this.set('_loadingMore', true);
    this._notifyInfinityModelLoading();
    return this._requestNextPage().then(function(objects) {
      self._nextPageLoaded(objects);
      return objects;
    }).finally(() => self.set('_loadingMore', false));
  }
});
