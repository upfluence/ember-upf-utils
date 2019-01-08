import Mixin from '@ember/object/mixin';

export default Mixin.create({
  infinityModelLoading() {
    this.controllerFor('application').set('isLoading', true);
  },
  infinityModelUpdated() {
    this.controllerFor('application').set('isLoading', false);
  }
});
