import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface LogoMakerArgs {
  icon: string;
  color: string;
  onChange(icon: string, color: string): void;
}

export const DEFAULT_ICONS = [
  'rabbit',
  'star',
  'heart',
  'rocket-launch',
  'money-bill',
  'glass-whiskey-rocks',
  'joystick',
  'scroll',
  'carrot',
  'volleyball-ball',
  'crown',
  'chart-bar',
  'users',
  'saxophone',
  'duck',
  'university',
  'tree-palm',
  'trophy',
  'pizza-slice',
  'popcorn',
  'chart-line',
  'analytics',
  'hat-wizard',
  'chart-network',
  'leaf',
  'utensils',
  'ufo',
  'hat-winter',
  'guitar',
  'parachute-box',
  'sheep',
  'boot',
  'shopping-basket',
  'shopping-cart',
  'shopping-bag',
  'tags',
  'meteor',
  'globe-americas',
  'globe-snow',
  'user-hair',
  'paper-plane-top',
  'star',
  'hexagon-xmark'
];

export const DEFAULT_COLORS = [
  'stone',
  'rose',
  'orange',
  'yellow',
  'lime',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuschia',
  'pink',
  'slate'
];

export function logoIconGenerator(): string {
  return `${DEFAULT_ICONS[Math.floor(Math.random() * DEFAULT_ICONS.length)]}:${
    DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)]
  }`;
}

export default class extends Component<LogoMakerArgs> {
  @tracked localLogoIcon: string | undefined;
  @tracked selectedIcon: string = this.args.icon;
  @tracked selectedColor: string = this.args.color;

  campaignColors = DEFAULT_COLORS;
  campaignIcons = DEFAULT_ICONS;

  get selectedIconClass(): string {
    return `logo-icon-selected logo-icon-color_${this.selectedColor}`;
  }

  @action
  setLogoIcon(icon: string): void {
    this.selectedIcon = icon;
    console.log(this.selectedIcon, this.selectedColor);
    this.args.onChange(this.selectedIcon, this.selectedColor);
  }

  @action
  setLogoColor(color: string): void {
    this.selectedColor = color;
    console.log(this.args.onChange);
    this.args.onChange(this.selectedIcon, this.selectedColor);
  }
}
