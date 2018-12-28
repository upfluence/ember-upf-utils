import { helper as buildHelper } from '@ember/component/helper';
import moment from 'moment';

let formatTimestamp = (timestamp) => moment.unix(timestamp).calendar();

let FormatTimestampHelper = buildHelper(formatTimestamp);

export { formatTimestamp };

export default FormatTimestampHelper;
