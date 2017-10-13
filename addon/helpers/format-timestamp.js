import Ember from 'ember';
import moment from 'moment';

let formatTimestamp = (timestamp) => moment.unix(timestamp).calendar();

let FormatTimestampHelper = Ember.Helper.helper(formatTimestamp);

export { formatTimestamp };

export default FormatTimestampHelper;
