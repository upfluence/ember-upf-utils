import Component from '@glimmer/component';
import { action } from '@ember/object';
import { later } from '@ember/runloop';

interface SideHoverPanelArgs {
  side: string;
  stickTo: string;
  width: string;
  height: string;
  disableScrolling: boolean;
  isOverContent: boolean;
  shouldAnimate: boolean;
  backdropAction?(): void;
}

export default class SideHoverPanel extends Component<SideHoverPanelArgs> {
  hoverPanel: HTMLElement | null = null;
  panelBackdrop: HTMLElement | null = null;

  get computedClassNames(): string {
    let classes = ['__side-hover-panel'];
    if (this.args.isOverContent) {
      classes.push('__side-hover-panel--over-content');
    }
    return classes.join(' ');
  }

  get side(): string {
    return this.args.side ?? 'right';
  }

  get shouldAnimate(): boolean {
    return this.args.shouldAnimate ?? true;
  }

  get width(): string {
    return this.args.width ?? '100%';
  }

  get height(): string {
    return this.args.height ?? '100%';
  }

  get disableScrolling(): boolean {
    return this.args.disableScrolling ?? false;
  }

  get stickTo(): string {
    return this.args.stickTo ?? 'right';
  }

  @action
  initialize(element: HTMLElement): void {
    this.hoverPanel = element.querySelector('.hover-panel')! as HTMLElement;
    this.hoverPanel.classList.add(this.side + '_side');
    this.hoverPanel.classList.add(this.stickTo + '_align');

    if (this.shouldAnimate) {
      this.hoverPanel.classList.add('animate');
    }

    later(() => {
      this.hoverPanel!.classList.add(this.side + '_transform');
    }, 0);

    if (this.args.backdropAction) {
      this.panelBackdrop = element.querySelector('.panel-backdrop');
      this.panelBackdrop!.classList.remove('hidden');
    }

    this.hoverPanel.style.width = this.width;
    this.hoverPanel.style.height = this.height;

    if (this.disableScrolling) {
      document.querySelector('body')?.classList.add('disable-scrolling');
    }
  }

  @action
  teardown(): void {
    this.hoverPanel?.remove();
    this.panelBackdrop?.classList.add('hidden');
    if (this.disableScrolling) {
      document.querySelector('body')?.classList.remove('disable-scrolling');
    }
  }

  @action
  backdrop(): void {
    this.args.backdropAction?.();
  }
}
