import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { observer } from '@ember/object';

export default Mixin.create({
  i18n: service(),

  _: observer('_error', function() {
    this.set('error', this.get('i18n').t(this.get('_error')));
  })
});
