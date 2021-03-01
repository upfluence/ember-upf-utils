import Mixin from '@ember/object/mixin';
import { debounce } from '@ember/runloop';

export default Mixin.create({
  attributeBindings: ['data-toggle', 'data-placement'],

  tooltipValuesObserver: [],

  init() {
    this._super(...arguments);

    this.tooltipValuesObserver.forEach((key) => {
      this.addObserver(key, this._rebuildTooltip);
    });
  },

  _buildTooltip() {
    let $els = this.$('[data-toggle="tooltip"]') || [];

    if ($els.length > 0) {
      $els.tooltip('fixTitle');
    }
  },

  _rebuildTooltip() {
    debounce(this, this._buildTooltip, 200);
  },

  didRender() {
    this._super();
    this.$('[data-toggle="tooltip"]').tooltip();
  }
});
