import Ember from 'ember';
import UpfTableSearchMixin from 'oss-components/mixins/upf-table-search';

const {
  Mixin,
  inject
} = Ember;

export default Mixin.create(UpfTableSearchMixin, {
  store: inject.service(),

  displayArchived: false,
  displayAccessPanel: false,
  searchCollection: 'accessPanelEntities',
  searchAttribute: 'name',

  init() {
    this.set('accessPanelEntities', []);

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
    let model = this.get('accessPanelConfig.model');
    this.get('store').query(
      model,
      { archived: this.get('displayArchived') }
    ).then((entities) => {
      this.set('accessPanelEntities', entities);
    });
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
