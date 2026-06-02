import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import type { FeedbackMessage } from '@upfluence/oss-components/components/o-s-s/input-container';
import type { IntlService } from 'ember-intl';

const VARIABLE_REGEX = /\{\{([^}]+)\}\}/g;

interface TemplatedInputGroupArgs {
  title: string;
  subtitle?: string;
  required?: boolean;
  value: string;
  variables: string[];
  placeholder?: string;
  feedbackMessage?: FeedbackMessage;
  disabled?: boolean;
  onChange(value: string, isValid: boolean): void;
}

export default class UtilsTemplatedInputGroup extends Component<TemplatedInputGroupArgs> {
  @service declare intl: IntlService;

  @tracked displayTemplateVariables = false;
  @tracked displayLocalValidationError = false;
  @tracked _inputValue = '';
  @tracked inputElement?: HTMLInputElement | null;
  @tracked insertVariableLink?: HTMLElement | null;

  constructor(owner: unknown, args: TemplatedInputGroupArgs) {
    super(owner, args);
    this._inputValue = args.value ?? '';
  }

  set inputValue(value: string) {
    this._inputValue = value;
    this.displayLocalValidationError = false;
    this.args.onChange(value, this.isInputValid);
  }

  get inputValue(): string {
    return this._inputValue;
  }

  get feedbackMessage(): FeedbackMessage | undefined {
    return this.args.feedbackMessage ?? this.localFeedbackMessage;
  }

  get localFeedbackMessage(): FeedbackMessage | undefined {
    const shouldDisplayLocalValidationError =
      this.displayLocalValidationError && this.hasInputValue && !this.isInputValid;

    return shouldDisplayLocalValidationError
      ? {
          type: 'error',
          value: this.intl.t('upf_utils.templated_input_group.error.invalid_merge_field')
        }
      : undefined;
  }

  get isInputValid(): boolean {
    return (
      !this.matchedVariables ||
      (this.matchedVariables.length === 1 && this.args.variables.includes(this.matchedVariables[0].slice(2, -2)))
    );
  }

  get matchedVariables(): RegExpMatchArray | null {
    return this.inputValue.match(VARIABLE_REGEX);
  }

  get hasInputValue(): boolean {
    return this.inputValue.trim().length > 0;
  }

  @action
  onInput(): void {
    const matches = [...this.inputValue.matchAll(VARIABLE_REGEX)];

    if (matches.length <= 1) return;

    const lastVariable = matches[matches.length - 1][0];
    this.inputValue = this.inputValue.replace(VARIABLE_REGEX, '').replace(/\s+/g, ' ') + lastVariable;
    this.inputElement?.focus();
  }

  @action
  insertVariable(variable: string, e: Event): void {
    e.stopPropagation();
    const formattedVariable = `{{${variable}}}`;

    if (this.matchedVariables) {
      this.inputValue = this.inputValue.replace(VARIABLE_REGEX, formattedVariable);
    } else {
      const variablePosition = this.inputValue.indexOf('{');
      const cursorPosition = this.inputElement?.selectionStart ?? this.inputValue.length;

      this.inputValue =
        variablePosition === -1
          ? this.inputValue.slice(0, cursorPosition) + formattedVariable + this.inputValue.slice(cursorPosition)
          : this.inputValue.slice(0, variablePosition) + formattedVariable;
    }

    this.inputElement?.focus();
    this.displayTemplateVariables = false;
  }

  @action
  triggerVariableInput(): void {
    const lastOpenIndex = this.inputValue.lastIndexOf('{{');
    const lastCloseIndex = this.inputValue.lastIndexOf('}}');

    this.displayTemplateVariables = lastOpenIndex !== -1 && lastOpenIndex > lastCloseIndex;
  }

  @action
  validateInput(): void {
    this.displayLocalValidationError = this.hasInputValue && !this.isInputValid;
  }

  @action
  toggleTemplateVariables(e: MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();
    if (this.args.disabled) return;
    this.displayTemplateVariables = !this.displayTemplateVariables;
  }

  @action
  closeTemplateVariables(_: HTMLElement, e: MouseEvent): void {
    if (!this.displayTemplateVariables) return;
    const isTargetTriggered =
      this.insertVariableLink &&
      (this.insertVariableLink === e.target || this.insertVariableLink.contains(e.target as HTMLElement));
    if (isTargetTriggered) {
      this.toggleTemplateVariables(e);
      return;
    }
    this.displayTemplateVariables = false;
  }

  @action
  registerInput(e: HTMLElement): void {
    this.inputElement = e.querySelector('input');
    this._inputValue = this.inputElement?.value ?? this.inputValue;
  }

  @action
  registerInsertVariableLink(el: HTMLElement): void {
    this.insertVariableLink = el;
  }

  preventBlur(e: MouseEvent): void {
    e.preventDefault();
  }
}
