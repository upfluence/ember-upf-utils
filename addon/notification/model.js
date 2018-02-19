import DS from 'ember-data';

const {
  Model,
  attr,
  belongsTo
} = DS;

export default DS.Model.extend({
  type: attr('string'),
  timestamp: attr('date')
});
