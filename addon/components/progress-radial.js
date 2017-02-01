import Ember from 'ember';
import layout from '../templates/components/progress-radial';

export default Ember.Component.extend({
  layout,
  classNames: ['progress-radial'],
  classNameBindings: ['modifier', 'position', 'sizeClass'],
  icon: null,
  displayIn: null,
  size: 'md', // "md" or "lg"

  modifier: Ember.computed('type', function() {
    return `progress-radial-${this.get('type')}`;
  }),

  displayValue: Ember.computed('value', 'percent', 'displayIn', function() {
    if (this.get('displayIn') === 'percent') {
      return `${this.get('percent')} %`;
    }

    return this.get('value');
  }),

  position: Ember.computed('percent', function() {
    return `progress-${this.get('percent')}`;
  }),

  sizeClass: Ember.computed('size', function() {
    return this.get('size') === 'lg' ? 'progress-radial-lg' : 'progress-radial-md';
  }),

  percent: Ember.computed('value', 'maxValue', function () {
    let value = this.get('value');
    let max = this.get('maxValue');

    if (value === null || !max) {
      return 0;
    }

    return Math.ceil(Math.min((value * 100) / max, 100));
  })
});
