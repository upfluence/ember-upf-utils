import Ember from 'ember';
import UpfTableSearchMixin from 'oss-components/mixins/upf-table-search';

const {
  Mixin
} = Ember;

export default Mixin.create(UpfTableSearchMixin, {
  displayArchived: false,
  displayAccessPanel: false,
  searchCollection: 'accessPanelEntities',
  searchAttribute: 'name',

  init() {
    [
      `${this.get('accessPanelConfig.model')}.@each.archived`,
      'displayAccessPanel',
      'displayArchived'
    ].forEach((property) => {
      this.addObserver(property, this, this.populateAccessPanel);
    });

    this._super();
  },

  populateAccessPanel() {
    this.set(
      'accessPanelEntities',
      this.get(this.get('accessPanelConfig.model')).filterBy(
        'archived',
        this.get('displayArchived')
      )
    );
  },

  actions: {
    toggleAccessPanel() {
      this.toggleProperty('displayAccessPanel');
    },

    toggleDisplayArchived() {
      this.toggleProperty('displayArchived');
    },

    esc() {
      this.set('displayAccessPanel', false);
      this.transitionToRoute(this.get('accessPanelConfig.backRoute'));
    },

    goToEntity(entity) {
      this.set('searchQuery', '');
      this.set('displayAccessPanel', false);
      this.transitionToRoute(
        this.get('accessPanelConfig.backRoute'),
        entity.get('id')
      );
    }
  }
});
