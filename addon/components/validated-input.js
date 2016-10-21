import Ember from 'ember';
import layout from '../templates/components/validated-input';

const { computed, defineProperty } = Ember;

export default Ember.Component.extend({
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

  hasLabel: computed.notEmpty('label').readOnly(),

  hasContent: computed.notEmpty('value').readOnly(),
  notValidating: computed.not('validation.isValidating').readOnly(),
  shouldDisplayValidations: computed.or('showValidations', 'hasContent').readOnly(),
  hasWarnings: computed.notEmpty('validation.warnings').readOnly(),
  hasNoWarnings: computed.not('hasWarnings').readOnly(),
  hasErrors: computed.notEmpty('validation.errors').readOnly(),
  isValid: computed.and('hasContent', 'validation.isTruelyValid').readOnly(),

  showFeedback: computed.or('showErrors', 'showWarnings', 'showSuccess').readOnly(),
  showErrors: computed.and('notValidating', 'hasContent', 'hasErrors').readOnly(),
  showWarnings: computed.and('shouldDisplayValidations', 'hasWarnings', 'isValid').readOnly(),
  showSuccess: computed.and('shouldDisplayValidations', 'hasNoWarnings', 'isValid').readOnly(),

  init() {
    this._super(...arguments);

    defineProperty(
      this,
      'validation',
      computed.readOnly(`model.validations.attrs.${this.get('valuePath')}`)
    );

    defineProperty(
      this, 'value', computed.alias(`model.${this.get('valuePath')}`)
    );
  },

  focusOut() {
    this._super(...arguments);
    this.set('showValidations', true);
  }
});
