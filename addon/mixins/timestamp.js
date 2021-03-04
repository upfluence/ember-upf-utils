import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import moment from 'moment';

export default Mixin.create({
  fullDate: computed('timestamp', function () {
    return new Date(this.timestamp * 1000).toString();
  }),

  dayMonth: computed('timestamp', function () {
    return new Date(this.timestamp * 1000).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }),

  formattedDate: computed('timestamp', function () {
    return moment.unix(this.timestamp).format('MMMM DD, YYYY');
  }),

  sinceDate: computed('timestamp', function () {
    return moment(moment.unix(this.timestamp)).fromNow();
  })
});
