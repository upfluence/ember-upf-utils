import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import moment from 'moment';

export default Mixin.create({
  get fullDate() {
    return new Date(this.timestamp * 1000).toString();
  },

  get dayMonth() {
    return new Date(this.timestamp * 1000).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  },

  get formattedDate() {
    return moment.unix(this.timestamp).format('MMMM DD, YYYY');
  },

  get sinceDate() {
    return moment(moment.unix(this.timestamp)).fromNow();
  }
});
