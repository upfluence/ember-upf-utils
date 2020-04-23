import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

const AUDIENCE_AGE_BRACKETS = [
  { name: '0-17'},
  { name: '18-24'},
  { name: '25-34'},
  { name: '35-54'},
]

export default Component.extend({
  layout,

  classNames: ['form-element', 'age-chooser'],
  ageBracketValues: AUDIENCE_AGE_BRACKETS,

  label: 'Age Bracket',
  placeholder: '-',
  required: false,
  multiple: true,
  dark: false,
  size: null,

  _selection: null,

  ageBracket: computed('_selection', {
    get() {
      return (this._selection || {}).name;
    },

    set(_, value) {
      this.set('_selection', AUDIENCE_AGE_BRACKETS.find((x) => x.name === value));

      return value;
    }
  }),

  ageBrackets: computed('_selection.[]', {
    get() {
      return (this._selection || []).map((x) => x.name);
    },

    set(_, value) {
      this.set('_selection', (value || []).map((v) => {
        return AUDIENCE_AGE_BRACKETS.find((x) => x.name === v);
      }));
      
      return value;
    }
  })
});
