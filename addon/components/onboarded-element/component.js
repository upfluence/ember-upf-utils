import Ember from 'ember';

const SHEPHERD_DEFAULT_CLASSES = 'shepherd upf-shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text';
const { Component, computed, inject } = Ember;

export default Component.extend({
  tour: inject.service(),

  classNames: ['onboarded-element'],

  dictionary: null,
  defaultDictionary: {},
  dictionaryToUse: computed.or('dictionary', 'defaultDictionary'),

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
      this.get('tour').start();
    }
  }
});
