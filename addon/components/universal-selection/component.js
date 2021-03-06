import Component from '@ember/component';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

import ExportEntity from '@upfluence/ember-upf-utils/export-entity/model';

import layout from './template';

export default Component.extend({
  layout,

  classNames: ['universal-selection'],

  exports: service(),
  toast: service(),

  multiple: true,
  canCreate: false,
  createItemComponent: null,
  items: null,
  current: null,
  label: null,
  placeholder: 'Import influencers from...',
  displayEmptyEntities: false,

  _performSearch(resolve) {
    return this.exports.searchEntities(this.keyword).then((response) => {
      resolve(
        Object.keys(response).reduce((acc, entityType) => {
          if (response[entityType].length > 0 && !acc.find((item) => acc.includes(item.type))) {
            acc.push({
              groupName: entityType,
              options: []
            });
          }
          response[entityType].forEach((item) => {
            acc.find((group) => {
              let itemDisplayCondition = true;

              if (!this.displayEmptyEntities) {
                itemDisplayCondition = item.total > 0;
              }

              if (group.groupName === entityType && itemDisplayCondition) {
                group.options.push(
                  ExportEntity.create({
                    id: item.id,
                    name: item.name,
                    total: item.total,
                    type: entityType
                  })
                );
              }
            });
          });
          return acc;
        }, [])
      );
    });
  },

  search() {
    return new RSVP.Promise((resolve) => {
      debounce(this, this._performSearch, resolve, 1000);
    }).catch(() => {
      this.toast.error('An error occurred, please try again');
    });
  },

  actions: {
    searchEntities(keyword) {
      this.set('keyword', keyword);
      this.set('items', this.search());
    },

    checkOptions() {
      if (!this.items) {
        this.send('searchEntities', '');
      }
    }
  }
});
