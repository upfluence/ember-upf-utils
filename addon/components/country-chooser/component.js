import Component from '@ember/component';
import { computed } from '@ember/object';
import CountryCodes from '@upfluence/ember-upf-utils/resources/country-codes';
import layout from './template';

export default Component.extend({
  layout,

  classNames: ['form-element', 'country-chooser'],
  codes: CountryCodes,

  label: 'Country',
  placeholder: '-',
  required: false,
  multiple: true,
  dark: false,

  _selection: null,

  countryCode: computed('_selection', {
    get() {
      return (this._selection || {}).id;
    },

    set(_, value) {
      this.set('_selection', CountryCodes.find((x) => x.id === value));

      return value;
    }
  }),

  countryCodes: computed('_selection.[]', {
    get() {
      return (this._selection || []).map((x) => x.id);
    },

    set(_, value) {
      this.set('_selection', (value || []).map((v) => {
        return CountryCodes.find((x) => x.id === v);
      }));

      return value;
    }
  })
});
