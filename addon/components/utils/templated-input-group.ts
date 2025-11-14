import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import type { IntlService } from 'ember-intl';
import type { FeedbackMessage } from '@upfluence/oss-components/components/o-s-s/input-container';

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
  @tracked _inputValue = '';
  @tracked inputElement?: HTMLInputElement | null;
  @tracked insertVariableLink?: HTMLElement | null;

  get inputValue(): string {
    return this.args.value;
  }

  set inputValue(value: string) {
    this._inputValue = value;
    this.args.onChange(value, this.isInputValid);
  }

  get feedbackMessage(): FeedbackMessage | undefined {
    return (
      this.args.feedbackMessage ??
      (!this.isInputValid
        ? {
            type: 'error',
            value: this.intl.t('upf_utils.templated_input_group.error.invalid_merge_field')
          }
        : undefined)
    );
  }

  get isInputValid(): boolean {
    return (
      !this.variableMatches ||
      (this.variableMatches.length === 1 && this.args.variables.includes(this.variableMatches[0].slice(2, -2)))
    );
  }

  get variableMatches(): RegExpMatchArray | null {
    return this._inputValue.match(VARIABLE_REGEX);
  }

  @action
  onInput(): void {
    const matches = [...this._inputValue.matchAll(VARIABLE_REGEX)];

    if (matches.length > 1) {
      const lastVariable = matches[matches.length - 1][0];
      this.inputValue = this._inputValue.replace(VARIABLE_REGEX, '').replace(/\s+/g, ' ') + lastVariable;
      this.inputElement?.focus();
    }
  }

  @action
  insertVariable(variable: string, e: Event): void {
    e.stopPropagation();
    const formattedVariable = `{{${variable}}}`;

    if (this.variableMatches) {
      this.inputValue = this._inputValue.replace(VARIABLE_REGEX, formattedVariable);
    } else {
      const variablePosition = this._inputValue.indexOf('{');
      const cursorPosition = this.inputElement?.selectionStart ?? this._inputValue.length;

      this.inputValue =
        variablePosition !== -1
          ? this._inputValue.slice(0, variablePosition) + formattedVariable
          : this._inputValue.slice(0, cursorPosition) + formattedVariable + this._inputValue.slice(cursorPosition);
    }

    this.inputElement?.focus();
    this.displayTemplateVariables = false;
  }

  @action
  triggerVariableInput(): void {
    const lastOpenIndex = this._inputValue.lastIndexOf('{{');
    const lastCloseIndex = this._inputValue.lastIndexOf('}}');

    this.displayTemplateVariables = lastOpenIndex !== -1 && lastOpenIndex > lastCloseIndex;
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
  }

  @action
  registerInsertVariableLink(el: HTMLElement): void {
    this.insertVariableLink = el;
  }

  preventBlur(e: MouseEvent): void {
    e.preventDefault();
  }
}
