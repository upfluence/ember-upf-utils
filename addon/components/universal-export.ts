import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { mapBy } from '@ember/object/computed';
import { inject as service, Registry } from '@ember/service';
import RSVP from 'rsvp';
import ToastService from '@upfluence/oss-components/services/toast';

interface UniversalExportArgs {
  hidden: boolean;
  closeModal(): void;
  didExport?(): void;
  currentEntity: any;
  currentEntityType: string;
  selectedInfluencers: { id: number }[];
  filters: { name: string; value: string }[];
}

export default class extends Component<UniversalExportArgs> {
  @service('exports' as keyof Registry) declare influencerExporter: any;
  @service declare toast: ToastService;

  @tracked currentTab: string = 'file';

  tabs: { [key: string]: boolean } = {
    external: false,
    file: true,
    overlap_file: false,
    full_file: false
  };

  constructor(owner: unknown, args: UniversalExportArgs) {
    super(owner, args);

    if (!this.args.selectedInfluencers && !this.args.currentEntity) {
      throw new Error(
        '[component/universal-export] You must provide a valid `selectedInfluencers` or `currentEntity` argument to use as an export source.'
      );
    }

    this.influencerExporter.getAvailableExports().then((availableExports: any) => {
      this.tabs.external = Object.keys(availableExports.destinations.entities).length > 0;

      ['overlap_file', 'full_file'].forEach((exportType) => {
        this.tabs[exportType] = availableExports.destinations.files.includes(exportType);
      });

      this.currentTab = this.tabs.external ? 'external' : 'file';
    });
  }

  @mapBy('args.selectedInfluencers', 'id') declare selectedInfluencerIds: number[];

  get selectedCount(): number {
    const idsCount = this.selectedInfluencerIds.length;

    if (idsCount === 0 && this.args.currentEntity) {
      return this.args.currentEntity.count;
    }

    return idsCount;
  }

  _exported(closeModal = true) {
    this.args.didExport?.();

    if (closeModal) {
      this.args.closeModal();
    }
  }

  @action
  setCurrent(tab: string): void {
    this.currentTab = tab;
  }

  @action
  performExport(to: `${string}:${number}`, defer: RSVP.Deferred<any>): void {
    let source;
    const destination = { to };

    if (this.selectedInfluencerIds.length > 0) {
      source = {
        influencer_ids: this.selectedInfluencerIds
      };
    } else {
      source = {
        from: `${this.args.currentEntityType}:${this.args.currentEntity.id}`,
        filters: this.args.filters
      };
    }

    this.influencerExporter
      .perform(source, destination)
      .then((data: any) => {
        if (data.status === 'scheduled') {
          this.toast.info(`${data.total} influencers are being exported.`, 'Export in progress');
        } else {
          this.toast.success(`${data.total} influencers have been exported.`, 'Export completed');
        }

        this._exported();
      })
      .finally(() => {
        defer.resolve();
      });
  }

  @action
  performFileExport(format: string, type: string) {
    const source = `${this.args.currentEntityType}:${this.args.currentEntity.id}`;
    const url = this.influencerExporter.getFileExportURL(
      source,
      format,
      type,
      this.selectedInfluencerIds,
      this.args.filters
    );

    window.open(url, '_blank');
    this._exported();
  }
}
