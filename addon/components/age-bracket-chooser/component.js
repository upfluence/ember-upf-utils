import Component from '@ember/component';
import layout from './template';

const AUDIENCE_AGE_BRACKETS = [{ name: '0-17' }, { name: '18-24' }, { name: '25-34' }, { name: '35-54' }];

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

  didReceiveAttrs() {
    this._super();
    if (this.multiple) {
      this.set(
        '_selection',
        (this.ageBrackets || []).map((v) => {
          return AUDIENCE_AGE_BRACKETS.findBy('name', v);
        })
      );
    } else {
      this.set('_selection', AUDIENCE_AGE_BRACKETS.findBy('name', this.ageBracket));
    }
  }
});
