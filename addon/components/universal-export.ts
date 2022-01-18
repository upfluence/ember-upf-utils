import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { mapBy } from '@ember/object/computed';
import { inject as service, Registry } from '@ember/service';
import ToastService from '@upfluence/oss-components/services/toast';

interface UniversalExportArgs {
  hidden: boolean;
  closeModal(): void;
  didExport?(): void;
  currentEntity: { count: number; id: number; [key: string]: any };
  currentEntityType: string;
  selectedInfluencers: { id: number }[];
  filters: { name: string; value: string }[];
  countKey?: string;
}

export default class extends Component<UniversalExportArgs> {
  @service('exports' as keyof Registry) declare influencerExporter: any;
  @service declare toast: ToastService;
  @service declare intl: any;

  @tracked currentTab: string = 'file';
  @tracked availableEntityDestinations: string[] = [];
  @tracked hasExternalExport: boolean = false;
  @tracked hasFileExport: boolean = true;
  @tracked hasOverlapFileExport: boolean = false;
  @tracked hasFullFileExport: boolean = false;

  constructor(owner: unknown, args: UniversalExportArgs) {
    super(owner, args);

    if (!this.args.selectedInfluencers && !this.args.currentEntity) {
      throw new Error(
        '[component/universal-export] Either @selectedInfluencers or @currentEntity/@currentEntityType args must be provided'
      );
    }

    this.influencerExporter.getAvailableExports().then((availableExports: any) => {
      this.availableEntityDestinations = availableExports.destinations.entities;

      this.hasExternalExport = (Object.keys(availableExports.destinations?.entities) || []).length > 0;
      this.hasOverlapFileExport = (availableExports.destinations.files || []).includes('overlap_file');
      this.hasFullFileExport = (availableExports.destinations.files || []).includes('full_file');

      this.currentTab = this.hasExternalExport ? 'external' : 'file';
    });
  }

  @mapBy('args.selectedInfluencers', 'id') declare selectedInfluencerIds: number[];

  get selectedCount(): number {
    const idsCount = this.selectedInfluencerIds.length;

    if (idsCount === 0 && this.args.currentEntity) {
      const countKey = this.args.countKey ?? 'count';
      return this.args.currentEntity[countKey];
    }

    return idsCount;
  }

  _exported(closeModal = true) {
    this.args.didExport?.();

    if (closeModal) {
      this.args.closeModal?.();
    }
  }

  @action
  setCurrent(tab: string): void {
    this.currentTab = tab;
  }

  @action
  async performExport(to: `${string}:${number}`): Promise<any> {
    let source;
    const destination = { to };

    if (this.selectedInfluencerIds.length > 0) {
      source = {
        influencer_ids: this.selectedInfluencerIds
      };
    } else {
      source = {
        from: `${this.args.currentEntityType}:${this.args.currentEntity.id}`,
        filters: this.args.filters || []
      };
    }

    return this.influencerExporter.perform(source, destination).then((data: any) => {
      if (data.status === 'scheduled') {
        this.toast.info(
          this.intl.t('export_influencers.export.scheduled.success_message', { count: data.total }),
          this.intl.t('export_influencers.export.scheduled.success_title')
        );
      } else {
        this.toast.success(
          this.intl.t('export_influencers.export.processed.success_message', { count: data.total }),
          this.intl.t('export_influencers.export.processed.success_title')
        );
      }

      this._exported();
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
      this.args.filters || []
    );

    window.open(url, '_blank');
    this._exported();
  }
}
