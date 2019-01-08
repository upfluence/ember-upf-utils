import LinkComponent from '@ember/routing/link-component';
import TooltipActivationMixin from '@upfluence/ember-upf-utils/mixins/tooltip-activation';

export default LinkComponent.reopen(TooltipActivationMixin);
