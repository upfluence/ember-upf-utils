import Ember from 'ember';

export default Ember.Mixin.create({
  infinityModelLoading() {
    this.controllerFor('application').set('isLoading', true);
  },
  infinityModelUpdated() {
    this.controllerFor('application').set('isLoading', false);
  }
});
