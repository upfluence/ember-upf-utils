import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { LOGO_COLORS, LOGO_ICONS } from '@upfluence/oss-components/utils/logo-config';

interface LogoMakerArgs {
  icon: string;
  color: string;
  onChange(icon: string, color: string): void;
}

export const DEFAULT_ICONS = [...LOGO_ICONS, 'user', 'paper-plane-top', 'handshake', 'octagon-xmark'];
export const DEFAULT_COLORS = LOGO_COLORS;

export function logoIconGenerator(): string {
  return `${DEFAULT_ICONS[Math.floor(Math.random() * DEFAULT_ICONS.length)]}:${
    DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)]
  }`;
}

export default class extends Component<LogoMakerArgs> {
  @tracked localLogoIcon?: string;
  @tracked selectedIcon: string = DEFAULT_ICONS[0];
  @tracked selectedColor: string = DEFAULT_COLORS[0];

  campaignColors = DEFAULT_COLORS;
  campaignIcons = DEFAULT_ICONS;

  constructor(owner: unknown, args: LogoMakerArgs) {
    super(owner, args);

    scheduleOnce('afterRender', this, this.initializeSelectedLogo);
  }

  get selectedIconClass(): string {
    return `logo-icon--selected logo-icon-color_${this.selectedColor}`;
  }

  @action
  setLogoIcon(icon: string): void {
    this.selectedIcon = icon;
    this.args.onChange(this.selectedIcon, this.selectedColor);
  }

  @action
  setLogoColor(color: string): void {
    this.selectedColor = color;
    this.args.onChange(this.selectedIcon, this.selectedColor);
  }

  private initializeSelectedLogo(): void {
    this.selectedIcon = this.args.icon;
    this.selectedColor = this.args.color;
  }
}
