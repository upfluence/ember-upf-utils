import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { observer } from '@ember/object';

export default Mixin.create({
  intl: service(),

  _: observer('_error', function() {
    this.set('error', this.intl.t(this.get('_error')));
  })
});
