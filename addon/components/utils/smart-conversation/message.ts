import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import moment from 'moment';

interface UtilsSmartConversationMessageComponentSignature {
  type: 'smart_reply' | 'user_prompt';
  value: string;
  timestamp: number;
}

export default class UtilsSmartConversationMessageComponent extends Component<UtilsSmartConversationMessageComponentSignature> {
  @tracked collapsed: boolean = true;

  get collapsible(): boolean {
    return this.args.type === 'smart_reply';
  }

  get computedClasses(): string {
    const classes = ['smart-conversation-message', `smart-conversation-message--${this.args.type}`];

    if (this.collapsible && this.collapsed) {
      classes.push('smart-conversation-message--collapsed');
    }

    return classes.join(' ');
  }

  get formattedTimestamp(): string {
    return moment(this.args.timestamp).format('DD/MM/YYYY, HH:mm');
  }

  @action
  toggleCollapsed(event: MouseEvent): void {
    event.stopPropagation();

    if (!this.collapsible) return;

    this.collapsed = !this.collapsed;
  }
}
