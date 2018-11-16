import Ember from 'ember';
import CountryCodes from 'ember-upf-utils/resources/country-codes';
import layout from './template';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  layout,

  classNames: ['form-element', 'country-chooser'],
  codes: CountryCodes,
  selection: [],

  label: 'Country',
  required: false,
  multiple: true,

  countryCode: null,
  countryCodes: computed('selection.[]', {
    get() {
      return this.get('selection').map((x) => x.id);
    },

    set(_, value) {
      this.set('selection', (value || []).map((v) => {
        return CountryCodes.find((x) => x.id === v);
      }));

      return value;
    }
  }),

  actions: {
    selectCountry(value) {
      this.set('countryCode', value);
    }
  }
});
