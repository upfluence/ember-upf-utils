import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, get } from '@ember/object';
import { inject as service } from '@ember/service';

const Limit = function (limit, spent) {
  return {
    spent,
    limit,
    left: limit - spent
  };
};

export default class extends Component {
  @service exports;
  @service currentUser;

  @tracked selectedFormat = 'csv';
  @tracked selectedType = 'short';
  @tracked loaded = false;
  @tracked types = [{ key: 'short', label: 'Basic' }];
  @tracked formats = {
    csv: '.csv',
    xlsx: '.xlsx'
  };
  @tracked exportLimit = {
    short: new Limit(-1, 0),
  };

  constructor(owner, args) {
    super(owner, args);

    this.loaded = false;

    if (this.args.enableOverlapFileExport) {
      if (!this.types.find((type) => type.key === 'overlap')) {
        this.types.push({ key: 'overlap', label: 'Overlap' });
      }
    }

    if (this.args.enableFullFileExport) {
      if (!this.types.find((type) => type.key === 'full')) {
        this.types = [...this.types, { key: 'full', label: 'All' }];
      }

      this.exports.getLimit((r) => {
        this.exportLimit = {
          ...this.exportLimit,
          ...{
            full: new Limit(r.limit, r.spent)
          }
        };
        this.loaded = true;
      });
    } else {
      this.loaded = true;
    }
  }

  get hasMultiType() {
    return this.types.length > 1;
  }

  get limitReached() {
    const limitForType = get(this, `exportLimit.${this.selectedType}.limit`);
    const spentForType = get(this, `exportLimit.${this.selectedType}.spent`);

    if (limitForType === -1) {
      return false;
    }

    return spentForType + this.args.selectedCount > limitForType;
  }

  get exportLimitLeft() {
    return get(this, `exportLimit.${this.selectedType}.left`);
  }

  get btnLocked() {
    return !this.loaded || this.limitReached;
  }

  @action
  formatChanged(format) {
    this.selectedFormat = format;
  }

  @action
  typeChanged(type) {
    this.selectedType = type;
  }

  @action
  submit() {
    this.args.performFileExport(this.selectedFormat, this.selectedType);
  }
}
