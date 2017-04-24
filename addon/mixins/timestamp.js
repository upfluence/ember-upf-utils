import Ember from 'ember';

export default Ember.Mixin.create({
  fullDate: Ember.computed('timestamp', function() {
    return new Date(this.get('timestamp') * 1000).toString();
  }),

  dayMonth: Ember.computed('timestamp', function() {
    return new Date(
      this.get('timestamp') * 1000
    ).toLocaleDateString(
      'en-US', {day: '2-digit', month: 'short', year: 'numeric'}
    );
  })
});
