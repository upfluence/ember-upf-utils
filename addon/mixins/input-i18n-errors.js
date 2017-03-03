import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

const { Mixin, observer } = Ember;

export default Mixin.create({
  i18n: Ember.inject.service(),

  _: observer('_error', function() {
    this.set('error', t(this.get('_error')));
  })
});
