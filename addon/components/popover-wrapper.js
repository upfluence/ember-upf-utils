import Component from '@glimmer/component';

export default class PopoverWrapper extends Component {
  trigger: 'hover',

  didInsertElement() {
    this.$('[data-toggle="popover"]').popover({
      trigger: this.trigger,
    })
  }
}
