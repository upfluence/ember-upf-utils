import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

const {
  Mixin,
  inject,
  observer
} = Ember;

export default Mixin.create({
  _: observer('_error', function() {
    this.set('error', t(this.get('_error')));
  })
});
