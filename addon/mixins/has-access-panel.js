import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import UpfTableSearchMixin from 'oss-components/mixins/upf-table-search';

export default Mixin.create(UpfTableSearchMixin, {
  store: service(),

  displayArchived: false,
  displayAccessPanel: false,
  searchCollection: 'accessPanelEntities',
  searchAttribute: 'name',
  contentLoading: false,
  shouldReloadAccessPanel: false,

  page: 1,
  meta: {},

  init() {
    this.set('accessPanelEntities', []);

    [
      `${this.get('accessPanelConfig.model')}.@each.archived`,
      'displayAccessPanel',
      'displayArchived',
      'shouldReloadAccessPanel',
      'page',
      'searchQuery'
    ].forEach((property) => {
      this.addObserver(property, this, this.populateAccessPanel);
    });

    this._super();
  },

  populateAccessPanel() {
    if (!this.displayAccessPanel) {
      return;
    }

    let model = this.get('accessPanelConfig.model');

    this.set('contentLoading', true);
    this.store
      .query(model, {
        archived: this.displayArchived,
        page: this.page,
        s: this.searchQuery
      })
      .then((entities) => {
        let current = this.model;
        let meta = entities.meta;
        entities = entities.toArray();

        if (this.get('accessPanelConfig.nestedModel')) {
          current = current[model];
        }

        if (current) {
          entities.removeObject(current);
          entities.splice(0, 0, current);
        }

        this.set('meta', meta);
        this.set('accessPanelEntities', entities);
        this.set('contentLoading', false);
        this.set('shouldReloadAccessPanel', false);
      });
  },

  actions: {
    toggleAccessPanel() {
      this.toggleProperty('displayAccessPanel');
      this.set('displayArchived', false);
      this.set('searchQuery', '');
    },

    toggleDisplayArchived() {
      this.toggleProperty('displayArchived');
    },

    esc() {
      this.set('displayAccessPanel', false);
      this.set('displayArchived', false);
      this.set('searchQuery', '');
      this.transitionToRoute(this.get('accessPanelConfig.backRoute'));
    },

    goToEntity(entity) {
      this.set('displayAccessPanel', false);
      this.set('displayArchived', false);
      this.set('searchQuery', '');
      entity.set('currentlyOpened', true);
      this.transitionToRoute(this.get('accessPanelConfig.backRoute'), entity.get('id'), {
        queryParams: this.get('accessPanelConfig.backRouteParams')
      });
    },

    didPageChange(page) {
      this.set('page', page);
    }
  }
});
