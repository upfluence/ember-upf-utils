import { action } from '@ember/object';
import { addObserver } from '@ember/object/observers';
import { tracked } from '@glimmer/tracking';

export default class {
  @tracked displayAccessPanel = false;
  @tracked displayArchived = false;
  @tracked searchQuery = '';
  @tracked contentLoading = false;
  @tracked accessPanelEntities = [];

  @tracked page = 1;
  @tracked meta = {};

  constructor(owner, config) {
    this.owner = owner;
    this.config = config;

    [
      `${config.model}.@each.archived`,
      'displayAccessPanel',
      'displayArchived',
      'shouldReloadAccessPanel',
      'searchQuery'
    ].forEach((property) => {
      addObserver(this, property, this.populateAccessPanel);
    });
  }

  populateAccessPanel() {
    if (!this.displayAccessPanel) {
      return;
    }

    let model = this.config.model;

    this.contentLoading = true;
    this.storeService
      .query(model, {
        archived: this.displayArchived,
        page: this.page,
        s: this.searchQuery
      })
      .then((entities) => {
        let current = this.model;
        let meta = entities.meta;
        entities = entities.toArray();

        if (this.config.nestedModel) {
          current = current[model];
        }

        if (current) {
          entities.removeObject(current);
          entities.splice(0, 0, current);
        }

        this.meta = meta;
        this.accessPanelEntities = entities;
        this.contentLoading = false;
        this.shouldReloadAccessPanel = false;
      });
  }

  get storeService() {
    return this.owner.lookup('service:store');
  }

  get routerService() {
    return this.owner.lookup('service:router');
  }

  get entityArchivingService() {
    return this.owner.lookup('service:entity-archiving');
  }

  get intlService() {
    return this.owner.lookup('service:intl');
  }

  get toastService() {
    return this.owner.lookup('service:toast');
  }

  @action
  toggleAccessPanel() {
    this.displayArchived = false;
    this.searchQuery = '';

    this.displayAccessPanel = !this.displayAccessPanel;
  }

  @action
  toggleDisplayArchived() {
    this.displayArchived = !this.displayArchived;
  }

  @action
  esc() {
    this.displayAccessPanel = false;
    this.displayArchived = false;
    this.searchQuery = '';
    this.routerService.transitionTo(this.config.backRoute);
  }

  @action
  goToEntity(entity) {
    this.displayAccessPanel = false;
    this.displayArchived = false;
    this.searchQuery = '';
    entity.set('currentlyOpened', true);
    this.routerService.transitionTo(this.config.entityRoute, entity.id, {
      queryParams: this.config.backRouteParams
    });
  }

  @action
  didPageChange(page) {
    this.page = page;
    this.populateAccessPanel();
  }

  @action
  bulkArchive(archivalAction, items, entityArchivingConfig) {
    this.contentLoading = true;
    this.entityArchivingService
      .bulkToggleArchive(entityArchivingConfig.name, items.mapBy('id'), archivalAction)
      .then(() => {
        const _selectedItems = items;
        items.setEach('selected', false);
        this.accessPanelEntities.removeObjects(_selectedItems);
      })
      .catch(() => {
        this.toastService.error(
          this.intlService.t(entityArchivingConfig.error),
          this.intlService.t(entityArchivingConfig.errorTitle)
        );
      })
      .finally(() => (this.contentLoading = false));
  }

  @action
  performSearch(keyword) {
    this.searchQuery = keyword;
  }
}
