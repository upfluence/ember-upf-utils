import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import ExportEntity from 'ember-upf-utils/export-entity/model';
import layout from './template';

export default Component.extend({
  layout,

  store: service(),

  classNames: ['ember-basic-dropdown-content__create-item'],

  formattedCreateButtonText: computed('searchTerm', function() {
    return this.get('createButtonTextTemplate').replace(
      '#item#',
      this.get('searchTerm')
    );
  }),

  actions: {
    createItem(_, defer) {
      if (isBlank(this.get('searchTerm'))) {
        defer.resolve();
        return;
      }

      let item = null;
      if (this.get('recordTypeIsModel')) {
        item = this.get('store').createRecord(this.get('recordType'), {
          name: this.get('searchTerm')
        });
      } else {
        item = ExportEntity.create({ name: this.get('searchTerm') });
      }

      if (this.get('multiple')) {
        this.get('selection').pushObject(item);
      } else {
        this.set('selection', item);
      }

      if (this.get('didCreate')) {
        this.didCreate(item);
      }

      defer.resolve();
    }
  }
});
