import Component from '@ember/component';
import layout from './template';

const CREATABLE_ENTITIES = ['list', 'mailing', 'stream'];

export default Component.extend({
  layout,

  classNames: ['padding-xx-sm'],

  createableEntities: CREATABLE_ENTITIES,
  selectedEntityType: 'list',

  didRender() {
    this.$('.dropdown-toggle').dropdown();
  },

  actions: {
    selectEntityType(type) {
      this.set('selectedEntityType', type);
    },

    createItem(_, defer) {
      defer.promise.then(() => this.select.actions.close());

      this.createItem(
        _,
        { type: this.selectedEntityType },
        defer
      );
    }
  }
});
