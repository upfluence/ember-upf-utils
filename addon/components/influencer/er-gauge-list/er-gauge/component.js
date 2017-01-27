import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['__er-gauge '],
  classNameBindings: ['colorScheme'],

  colorScheme: Ember.computed('media', 'type', function() {
    if (this.get('media.engagement_rate') || this.get('media.averageFacebookShares')) {
      return `color-${this.get('type')}`;
    }

    return "color-disabled";
  }),

  style: Ember.computed('position', function() {
    return Ember.String.htmlSafe(`width: ${this.get('position')}%;`);
  }),

  position: Ember.computed(
    'meta.erMin',
    'meta.erMax',
    'media.averageFacebookShares', function() {
      if (this.get('media.engagement_rate')) {
        return (this.get('media.engagement_rate') - (this.get('meta.erMin') / (this.get('meta.erMax') - this.get('meta.erMin')))) * 2000;
      } else if (this.get('media.averageFacebookShares')) {
        return this.get('media.averageFacebookShares') * 2;
      } else {
        return 0;
      }
    })
});
