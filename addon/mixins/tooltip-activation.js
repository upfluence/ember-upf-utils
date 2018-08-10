import Ember from 'ember';

const { Mixin, run } = Ember;

const _rebuildTooltip = function() {
  run.debounce(this, function() {
    this.$('[data-toggle="tooltip"]').tooltip('fixTitle');
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
