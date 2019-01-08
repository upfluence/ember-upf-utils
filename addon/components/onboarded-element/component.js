import { inject as service } from '@ember/service';
import { or } from '@ember/object/computed';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';

const SHEPHERD_DEFAULT_CLASSES = 'shepherd upf-shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text';

export default Component.extend({
  tour: service(),

  classNames: ['onboarded-element'],

  dictionary: null,
  defaultDictionary: {},
  dictionaryToUse: or('dictionary', 'defaultDictionary'),

  stepsToRun: computed('steps', function() {
    return this.get('steps').split(',').map((step) => {
      return this.get('dictionaryToUse').get(step);
    }).filter((step) => {
      return !window.localStorage.getItem(`${step.id}-shown`);
    });
  }),

  didInsertElement() {
    this.get('tour').set('defaults', {
      classes: SHEPHERD_DEFAULT_CLASSES,
      scrollTo: false,
      showCancelLink: true
    });
    this.get('tour').set('steps', this.get('stepsToRun'));

    if (this.get('autostart')) {
      run.later(() => {
        this.get('tour').start();
      }, 1000);
    }
  }
});
