import Model, { attr } from '@ember-data/model';

export default Model.extend({
  type: attr('string'),
  timestamp: attr('date')
});
