import Ember from 'ember';

export default Ember.Mixin.create({
  _notifyInfinityModelLoading() {
    if (!this.get('infinityModelLoading')) { return; }
    return Ember.run.scheduleOnce('afterRender', this, 'infinityModelLoading');
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
