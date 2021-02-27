import {
  notEmpty,
  not,
  or,
  and,
  readOnly,
  alias
} from '@ember/object/computed';
import Component from '@ember/component';
import { defineProperty } from '@ember/object';
import layout from '../templates/components/validated-input';

export default Component.extend({
  layout,
  classNames: ['form-group'],
  classNameBindings: [
    'showSuccess:has-success',
    'showWarnings:has-warning',
    'showErrors:has-error',
    'showFeedback:has-feedback'
  ],

  label: '',
  placeHolder: '',
  valuePath: '',
  model: null,

  showValidations: false,

  hasLabel: notEmpty('label').readOnly(),

  hasContent: notEmpty('value').readOnly(),
  notValidating: not('validation.isValidating').readOnly(),
  shouldDisplayValidations: or('showValidations', 'hasContent').readOnly(),
  hasWarnings: notEmpty('validation.warnings').readOnly(),
  hasNoWarnings: not('hasWarnings').readOnly(),
  hasErrors: notEmpty('validation.errors').readOnly(),
  isValid: and('hasContent', 'validation.isTruelyValid').readOnly(),

  showFeedback: or('showErrors', 'showWarnings', 'showSuccess').readOnly(),
  showErrors: and('notValidating', 'hasContent', 'hasErrors').readOnly(),
  showWarnings: and('shouldDisplayValidations', 'hasWarnings').readOnly(),
  showSuccess: and('shouldDisplayValidations', 'hasNoWarnings', 'isValid').readOnly(),

  init() {
    this._super(...arguments);

    defineProperty(
      this,
      'validation',
      readOnly(`model.validations.attrs.${this.valuePath}`)
    );

    defineProperty(
      this, 'value', alias(`model.${this.valuePath}`)
    );
  },

  focusOut() {
    this._super(...arguments);
    this.set('showValidations', true);
  }
});
