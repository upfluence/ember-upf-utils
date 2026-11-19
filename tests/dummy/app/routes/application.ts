import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type { IntlService } from 'ember-intl';

export default class Application extends Route {
  @service declare intl: IntlService;

  beforeModel() {
    this.intl.locale = 'en-us';
  }
}
