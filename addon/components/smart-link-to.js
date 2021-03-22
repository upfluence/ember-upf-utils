import { getOwner } from '@ember/application';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SmartLinkToComponent extends Component {
  @service router;

  @tracked tagName = '';
  @tracked cssClass = null;
  @tracked target = null;

  get isRoute() {
    return getOwner(this).hasRegistration(`route:${this.args.link}`);
  }

  constructor() {
    super(...arguments);

    if(this.args.link === "application") {
      this.cssClass = "active";
    }
  }
}
