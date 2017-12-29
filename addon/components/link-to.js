import Ember from 'ember';
import TooltipActivationMixin from 'ember-upf-utils/mixins/tooltip-activation';

const { LinkComponent } = Ember;

export default LinkComponent.reopen(TooltipActivationMixin, {
  attributeBindings: ['data-toggle', 'data-placement']
});
