import { inject as service } from '@ember/service';

import Component from '@ember/component';
import RSVP from 'rsvp';
import { observer, computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,
  exports: service(),
  store: service(),
  intl: service(),
  currentUser: service(),

  current: null,
  _canCreate: true,

  placeholder: 'Move to...',
  user: null,

  init() {
    this._super();
    this.currentUser.fetch().then((user) => {
      this.set('user', user);
    });
  },

  displayInfo: computed('user.companies.{firstObject.billing_format,length}', function () {
    return this.user.companies?.[0]?.billing_format !== 'bracket';
  }),

  disabledExport: computed('current', 'selectedCount', function () {
    return !this.current || !this.selectedCount;
  }),

  currentObserver: observer('current', function () {
    this.set('errors', null);
  }),

  ctaLabel: computed('current', 'current.type', function () {
    let cta = this.intl.t('export_influencers.export.cta');

    if (this.current) {
      cta += ' ';
      cta += this.intl.t(`export_influencers.export.${this.current.type}`);
    }

    return cta;
  }),

  actions: {
    submit() {
      this.set('loading', true);
      new RSVP.Promise((resolve) => {
        if (!this.current.get('id')) {
          let data = {
            type: this.current.type,
            name: this.current.name
          };

          return this.exports.createEntity(data, (response) => {
            this.current.set('id', response.entity.id);
            resolve(this.current);
          });
        } else {
          resolve(this.current);
        }
      }).then((item) => {
        this.performExport(`${item.type}:${item.id}`).finally(() => {
          this.set('loading', false);
        });
      });
    }
  }
});
