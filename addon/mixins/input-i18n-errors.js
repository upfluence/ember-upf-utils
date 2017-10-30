import Ember from 'ember';

const {
  Mixin,
  observer,
  inject
} = Ember;

export default Mixin.create({
  i18n: inject.service(),

  _: observer('_error', function() {
    this.set('error', this.get('i18n').t(this.get('_error')));
  })
});
