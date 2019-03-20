import Mixin from '@ember/object/mixin';
import { run } from '@ember/runloop';

const _rebuildTooltip = function() {
  run.debounce(this, function() {
    let $els = this.$('[data-toggle="tooltip"]') || [];
    if ($els.length > 0) {
      $els.tooltip('fixTitle');
    }
  }, 200);
};

export default Mixin.create({
  attributeBindings: ['data-toggle', 'data-placement'],

  tooltipValuesObserver: [],

  init() {
    this._super(...arguments);

    this.get('tooltipValuesObserver').forEach((key) => {
      this.addObserver(key, _rebuildTooltip);
    });
  },

  didRender() {
    this._super();
    this.$('[data-toggle="tooltip"]').tooltip();
  }
});
