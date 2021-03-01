import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default Model.extend({
  type: attr('string'),
  timestamp: attr('date')
});
