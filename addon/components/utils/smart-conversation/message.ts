import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import moment from 'moment';

interface UtilsSmartConversationMessageComponentSignature {
  type: 'smart_reply' | 'user_prompt';
  collapsible?: boolean;
  value: string;
  timestamp: number;
}

export default class UtilsSmartConversationMessageComponent extends Component<UtilsSmartConversationMessageComponentSignature> {
  @tracked collapsed: boolean = true;
  @tracked overflows: boolean = false;

  get computedClasses(): string {
    const classes = ['smart-conversation-message', `smart-conversation-message--${this.args.type}`];

    if (this.collapsible && this.collapsed && this.overflows) {
      classes.push('smart-conversation-message--collapsed');
    }

    return classes.join(' ');
  }

  get formattedTimestamp(): string {
    return moment(this.args.timestamp).format('DD/MM/YYYY, HH:mm');
  }

  @action
  measureOverflow(element: HTMLElement): void {
    const maxHeight = parseFloat(getComputedStyle(element).getPropertyValue('--collapsed-max-height'));

    this.overflows = element.scrollHeight > maxHeight;
  }

  @action
  toggleCollapsed(event: MouseEvent): void {
    event.stopPropagation();

    if (!this.collapsible || !this.overflows) return;

    this.collapsed = !this.collapsed;
  }

  private get collapsible(): boolean {
    return this.args.collapsible ?? true;
  }
}
