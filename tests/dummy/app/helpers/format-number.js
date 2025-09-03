import { helper } from '@ember/component/helper';
import { formatNumber } from '@upfluence/ember-upf-utils/helpers/format-number';

// overrides node_modules/ember-intl/addon/helpers/format-number.ts from oss-components in dummy app
export default helper(formatNumber);
